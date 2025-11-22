import {
  FavoriteFolderModel,
  FavoriteModel,
  HistoryModel,
  VideoModel,
  VideoStatsModel,
} from '@/models'
import { Types } from 'mongoose'
import {
  FavoriteAddBatchDTO,
  FavoriteDeleteBatchDTO,
  FavoriteFolderAddDTO,
  FavoriteFolderList,
  FavoriteFolderListItem,
  FavoriteFolderUpdateDTO,
  FavoriteList,
  FavoriteListDTO,
  FavoriteListItem,
  FavoriteListSort,
  FavoriteMoveBatchDTO,
  FavoriteRecentItem,
} from '@mtobdvlb/shared-types'
import { HttpError } from '@/utils'
import { MESSAGE } from '@/constants'

export const FavoriteService = {
  listFolder: async (userId: string) => {
    const folders = await FavoriteFolderModel.find({ userId })
      .sort({
        createdAt: 1,
      })
      .lean()

    const result: FavoriteFolderList = await Promise.all(
      folders.map(async (folder) => {
        const count = await FavoriteModel.countDocuments({ folderId: folder._id })

        return {
          id: folder._id.toString(),
          name: folder.name,
          number: count,
          type: folder.type,
          thumbnail: folder.thumbnail,
          description: folder.description,
        }
      })
    )

    return result
  },
  list: async ({
    pageSize,
    page,
    favoriteFolderId,
    sort,
    kw,
  }: FavoriteListDTO): Promise<{ list: FavoriteList; total: number }> => {
    const match: Record<string, unknown> = {}

    if (favoriteFolderId) {
      match.folderId = new Types.ObjectId(favoriteFolderId)
    }

    if (kw && kw.trim() !== '') {
      match.$or = [
        { title: { $regex: kw, $options: 'i' } },
        { description: { $regex: kw, $options: 'i' } },
      ]
    }

    const sortMap: Record<FavoriteListSort, Record<string, 1 | -1>> = {
      favoriteAt: { createdAt: -1 },
      views: { 'videostat.viewsCount': -1 },
      publishedAt: { 'video.publishedAt': -1 },
    }

    const [result] = await FavoriteModel.aggregate<{
      total: number
      list: FavoriteListItem[]
    }>([
      { $match: match },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoId',
          foreignField: '_id',
          as: 'video',
        },
      },
      { $unwind: { path: '$video', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'video.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'videostats',
          localField: 'videoId',
          foreignField: 'videoId',
          as: 'videostat',
        },
      },
      { $unwind: { path: '$videostat', preserveNullAndEmptyArrays: true } },
      { $sort: sortMap[sort] },
      {
        $facet: {
          total: [{ $count: 'count' }],
          list: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                id: '$_id',
                favoriteAt: '$createdAt',
                video: {
                  id: '$video._id',
                  title: { $ifNull: ['$video.title', '[已删除]'] },
                  time: { $ifNull: ['$video.time', 0] },
                  thumbnail: { $ifNull: ['$video.thumbnail', ''] },
                  url: { $ifNull: ['$video.url', ''] },
                  views: { $ifNull: ['$videostat.viewsCount', 0] },
                  danmakus: { $ifNull: ['$video.danmakusCount', 0] },
                  publishedAt: { $ifNull: ['$video.publishedAt', 0] },
                },
                user: {
                  id: { $ifNull: ['$user._id', ''] },
                  name: { $ifNull: ['$user.name', '[已注销]'] },
                  avatar: { $ifNull: ['$user.avatar', ''] },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
          list: 1,
        },
      },
    ])

    return {
      total: result?.total ?? 0,
      list: (result?.list ?? []).map((item) => ({
        id: item.id.toString(),
        favoriteAt: item.favoriteAt,
        video: {
          ...item.video,
          id: item.video.id?.toString() ?? '',
        },
        user: {
          ...item.user,
          id: item.user.id?.toString() ?? '',
        },
      })),
    } satisfies { total: number; list: FavoriteList }
  },
  listRecent: async (userId: string) => {
    const folders = await FavoriteFolderModel.find({ userId }).lean()

    return Promise.all(
      folders.map(async (folder) => {
        const { list } = await FavoriteService.list({
          favoriteFolderId: folder._id.toString(),
          page: 1,
          pageSize: 20,
          sort: 'favoriteAt',
        })

        const item: FavoriteRecentItem = {
          folderId: folder._id.toString(),
          folderName: folder.name,
          list,
        }
        return item
      })
    )
  },
  deleteBatch: async ({ ids }: FavoriteDeleteBatchDTO, userId: string) => {
    if (!ids.length) return
    const deletedCount = await FavoriteModel.deleteMany({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
      userId: new Types.ObjectId(userId),
    })
    if (deletedCount.deletedCount > 0) {
      await VideoStatsModel.updateMany(
        { videoId: { $in: ids.map((id) => new Types.ObjectId(id)) } },
        { $inc: { favoritesCount: -1 } }
      )
    }
  },
  cleanWatchLater: async (userId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      userId: new Types.ObjectId(userId),
      type: 'watch_later',
    }).lean()

    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)

    // 找到 watch_later 文件夹里的所有收藏
    const favorites = await FavoriteModel.find({ folderId: folder._id }).lean()

    if (!favorites.length) return

    // 找到对应的 history 记录
    const histories = await HistoryModel.find({
      userId: new Types.ObjectId(userId),
      videoId: { $in: favorites.map((f) => f.videoId) },
    }).lean()

    // 预处理：视频观看时长映射
    const historyMap = new Map<string, number>()
    histories.forEach((h) => {
      historyMap.set(h.videoId.toString(), h.duration ?? 0)
    })

    // 查视频时长，判断哪些已看完
    const videos = await VideoModel.find({
      _id: { $in: favorites.map((f) => f.videoId) },
    })
      .select('_id duration')
      .lean()

    const finishedVideoIds = videos
      .filter((video) => {
        const watched = historyMap.get(video._id.toString()) ?? 0
        return watched >= (video.time ?? 0) * 0.98 && video.time > 0
      })
      .map((video) => video._id)

    if (!finishedVideoIds.length) return

    // 删除 watch_later 收藏夹里的已看完视频
    await FavoriteModel.deleteMany({
      folderId: folder._id,
      videoId: { $in: finishedVideoIds },
    })
    await VideoStatsModel.updateMany(
      { videoId: { $in: finishedVideoIds } },
      { $inc: { favoritesCount: -1 } }
    )
  },
  addBatch: async ({ videoIds, folderId }: FavoriteAddBatchDTO, userId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      _id: new Types.ObjectId(folderId),
      userId: new Types.ObjectId(userId),
    })
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)

    const existingFavorites = await FavoriteModel.find({
      folderId,
      videoId: { $in: videoIds.map((id) => new Types.ObjectId(id)) },
    }).lean()

    const existingVideoIds = new Set(existingFavorites.map((fav) => fav.videoId.toString()))

    const toInsert = videoIds
      .filter((vid) => !existingVideoIds.has(vid))
      .map((vid) => ({
        userId: new Types.ObjectId(userId),
        folderId: new Types.ObjectId(folderId),
        videoId: new Types.ObjectId(vid),
      }))

    if (toInsert.length) {
      await FavoriteModel.insertMany(toInsert)

      await VideoStatsModel.updateMany(
        { videoId: { $in: videoIds.map((id) => new Types.ObjectId(id)) } },

        { $inc: { favoritesCount: 1 } }
      )
    }
  },
  moveBatch: async ({ ids, targetFolderId }: FavoriteMoveBatchDTO, userId: string) => {
    const targetFolder = await FavoriteFolderModel.findOne({
      _id: new Types.ObjectId(targetFolderId),
      userId: new Types.ObjectId(userId),
    })
    if (!targetFolder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)
    const favorites = await FavoriteModel.find({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
      userId: new Types.ObjectId(userId),
    }).lean()
    await FavoriteModel.updateMany(
      { _id: { $in: favorites.map((f) => f._id) } },
      { $set: { folderId: new Types.ObjectId(targetFolderId) } }
    )
  },
  folderAdd: async ({ thumbnail, name, description }: FavoriteFolderAddDTO, userId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      userId,
      name,
    })
    if (folder) throw new HttpError(400, MESSAGE.FOLDER_EXIST)
    await FavoriteFolderModel.create({
      userId: new Types.ObjectId(userId),
      thumbnail: thumbnail ? thumbnail : undefined,
      name,
      description,
    })
  },
  get: async (videoId: string, userId: string) => {
    const favorite = await FavoriteModel.findOne({
      videoId,
      userId,
    })
    return favorite ? 0 : 1
  },
  detailByFolderId: async (folderId: string): Promise<FavoriteFolderListItem> => {
    const folder = await FavoriteFolderModel.findById(folderId).lean()
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)

    const count = await FavoriteModel.countDocuments({ folderId: folder._id })

    return {
      id: folder._id.toString(),
      name: folder.name,
      thumbnail: folder.thumbnail,
      type: folder.type,
      number: count,
      description: folder.description,
    }
  },
  folderDelete: async (userId: string, folderId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      _id: new Types.ObjectId(folderId),
      userId: new Types.ObjectId(userId),
    })
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)
    if (folder.type === 'watch_later') throw new HttpError(400, '稍后再看文件夹不能删除')
    if (folder.type === 'default') throw new HttpError(400, '默认收藏夹不能删除')

    // 获取该文件夹下的收藏
    const favorites = await FavoriteModel.find({ folderId: folder._id }).lean()
    const videoIds = favorites.map((f) => f.videoId).filter(Boolean)

    // 删除收藏记录
    await FavoriteModel.deleteMany({ folderId: folder._id })

    // 更新视频收藏数
    if (videoIds.length > 0) {
      await VideoStatsModel.updateMany(
        { videoId: { $in: videoIds } },
        { $inc: { favoritesCount: -1 } }
      )
    }

    // 删除收藏夹
    await FavoriteFolderModel.deleteOne({ _id: folder._id })
  },

  // 更新收藏夹
  folderUpdate: async (
    userId: string,
    folderId: string,
    { name, thumbnail, description }: FavoriteFolderUpdateDTO
  ) => {
    const folder = await FavoriteFolderModel.findOne({
      _id: new Types.ObjectId(folderId),
      userId: new Types.ObjectId(userId),
    })
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)

    const updateData: Partial<FavoriteFolderAddDTO> = {}
    if (name !== undefined && folder.type === 'normal') updateData.name = name.trim()
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (description !== undefined) updateData.description = description

    if (Object.keys(updateData).length === 0) return // 没有更新字段直接返回

    await FavoriteFolderModel.updateOne({ _id: folder._id }, { $set: updateData })
  },
  watchLaterAddOrDelete: async (userId: string, videoId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      userId,
      type: 'watch_later',
    })
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)
    const favorite = await FavoriteModel.findOne({
      videoId,
      userId,
      folderId: folder._id,
    })
    if (favorite) {
      await FavoriteModel.deleteOne({ _id: favorite._id })
      await VideoStatsModel.updateOne(
        { videoId: new Types.ObjectId(videoId) },
        { $inc: { favoritesCount: -1 } }
      )
    } else {
      await FavoriteModel.create({
        userId: new Types.ObjectId(userId),
        folderId: folder._id,
        videoId: new Types.ObjectId(videoId),
      })
      await VideoStatsModel.updateOne(
        { videoId: new Types.ObjectId(videoId) },
        { $inc: { favoritesCount: 1 } }
      )
    }
  },
  isWatchLater: async (userId: string, videoId: string) => {
    const folder = await FavoriteFolderModel.findOne({
      userId,
      type: 'watch_later',
    })
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)
    const favorite = await FavoriteModel.findOne({
      videoId,
      userId,
      folderId: folder._id,
    })
    return favorite ? 1 : 0
  },
}
