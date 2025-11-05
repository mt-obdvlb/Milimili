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
  FavoriteAddDTO,
  FavoriteDeleteBatchDTO,
  FavoriteFolderAddDTO,
  FavoriteFolderList,
  FavoriteList,
  FavoriteListDTO,
  FavoriteListItem,
  FavoriteMoveBatchDTO,
  FavoriteRecentItem,
} from '@mtobdvlb/shared-types'
import { HttpError } from '@/utils'
import { MESSAGE } from '@/constants'

export const FavoriteService = {
  listFolder: async (userId: string) => {
    const folders = await FavoriteFolderModel.find({ userId }).lean()

    const result: FavoriteFolderList = await Promise.all(
      folders.map(async (folder) => {
        const count = await FavoriteModel.countDocuments({ folderId: folder._id })

        return {
          id: folder._id.toString(),
          name: folder.name,
          number: count,
          type: folder.type,
          thumbnail: folder.thumbnail,
        }
      })
    )

    return result
  },
  list: async ({ userId, pageSize, page, favoriteFolderId }: FavoriteListDTO) => {
    const match: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    }
    if (favoriteFolderId) {
      match.folderId = new Types.ObjectId(favoriteFolderId)
    }

    const [result] = await FavoriteModel.aggregate<{
      total: number
      list: FavoriteListItem[]
    }>([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          list: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'videos',
                localField: 'videoId',
                foreignField: '_id',
                as: 'video',
              },
            },
            {
              $unwind: {
                path: '$video',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'video.userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                id: '$_id',
                video: {
                  id: '$video._id',
                  title: { $ifNull: ['$video.title', '[已删除]'] },
                  time: { $ifNull: ['$video.time', 0] },
                  thumbnail: { $ifNull: ['$video.thumbnail', ''] },
                },
                user: {
                  id: { $ifNull: ['$user._id', ''] },
                  name: { $ifNull: ['$user.name', '[已注销]'] },
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
          userId,
          favoriteFolderId: folder._id.toString(),
          page: 1,
          pageSize: 20,
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
  add: async ({ userId, videoId, folderId }: FavoriteAddDTO) => {
    const video = await VideoModel.findById(videoId)
    const folder = await FavoriteFolderModel.findById(folderId)
    if (!video) throw new HttpError(400, MESSAGE.VIDEO_NOT_FOUND)
    if (!folder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)
    const favorite = await FavoriteModel.findOne({
      videoId,
      folderId,
    })
    if (favorite) throw new HttpError(400, MESSAGE.FAVORITE_EXIST)
    await FavoriteModel.create({
      userId,
      videoId,
      folderId,
    })
    await VideoStatsModel.updateOne({ videoId }, { $inc: { favoritesCount: 1 } })
  },
  deleteBatch: async ({ ids }: FavoriteDeleteBatchDTO) => {
    if (!ids.length) return
    await FavoriteModel.deleteMany({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    })
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
  },
  addBatch: async ({ videoIds, folderId }: FavoriteAddBatchDTO, userId: string) => {
    const folder = await FavoriteFolderModel.findById(folderId)
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
      await VideoStatsModel.updateOne(
        { videoId: { $in: videoIds.map((id) => new Types.ObjectId(id)) } },
        { $set: { favoritesCount: 0 } },
        { upsert: true }
      )
      await VideoStatsModel.updateMany(
        { videoId: { $in: videoIds.map((id) => new Types.ObjectId(id)) } },

        { $inc: { favoritesCount: 1 } }
      )
    }
  },
  moveBatch: async ({ ids, targetFolderId }: FavoriteMoveBatchDTO) => {
    const targetFolder = await FavoriteFolderModel.findById(targetFolderId)
    if (!targetFolder) throw new HttpError(400, MESSAGE.FAVORITE_FOLDER_NOT_FOUND)

    await FavoriteModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
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
}
