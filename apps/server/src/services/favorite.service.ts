import { FavoriteFolderModel, FavoriteModel } from '@/models'
import { FavoriteFolderListVO } from '@/vos/favorite/folder-list.vo'
import { FavoriteListDTO } from '@/dtos/favorite/list.dto'
import { FavoriteListItem, FavoriteListVO, FavoriteRecentItem } from '@/vos/favorite/list.vo'
import { Types } from 'mongoose'

export const FavoriteService = {
  listFolder: async (userId: string) => {
    const folders = await FavoriteFolderModel.find({ userId }).lean()

    const result: FavoriteFolderListVO = await Promise.all(
      folders.map(async (folder) => {
        const count = await FavoriteModel.countDocuments({ folderId: folder._id })

        return {
          id: folder._id.toString(),
          name: folder.name,
          number: count,
          type: folder.type,
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
      match.favoriteFolderId = new Types.ObjectId(favoriteFolderId)
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
                  time: { $ifNull: ['$video.duration', 0] },
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
    } satisfies { total: number; list: FavoriteListVO }
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
}
