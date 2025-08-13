import { UserModel, VideoModel, VideoStatsModel } from '@/models'
import { VideoListItem } from '@/vos/video/list.vo'
import { VideoCreateDTO } from '@/dtos/video/create.dto'
import { MESSAGE } from '@/constants'

export const VideoService = {
  list: async ({ page, pageSize }: { page: number; pageSize: number }) => {
    console.log(page, pageSize)
    const videoIds = await VideoModel.find({ isOpen: true }, { _id: 1 }).lean()
    const total = videoIds.length
    if (total === 0) return []

    const idsToFetch = Array.from({ length: pageSize }, (_, i) => {
      const index = (page * pageSize + i) % total
      return videoIds[index]!._id
    })

    const videos = await VideoModel.aggregate<VideoListItem>([
      { $match: { _id: { $in: idsToFetch } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'videostats',
          localField: '_id',
          foreignField: 'videoId',
          as: 'videostat',
        },
      },
      {
        $unwind: '$videostat',
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          title: 1,
          thumbnail: 1,
          time: 1,
          views: '$videostat.views',
          danmakus: '$videostat.danmakus',
          username: '$user.name',
          publishedAt: '$createdAt',
          userId: '$user._id',
        },
      },
    ])

    const videoMap = new Map(videos.map((v) => [v.id, v]))
    return idsToFetch.map((id) => videoMap.get(id.toString())!).filter(Boolean)
  },
  create: async (body: VideoCreateDTO, userId: string) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    const res = await VideoModel.create({ ...body, userId })
    await VideoStatsModel.create({ videoId: res._id })
  },
}
