import { DanmakuModel, UserModel, VideoModel, VideoStatsModel } from '@/models'
import { MESSAGE } from '@/constants'
import { HttpError } from '@/utils/http-error.util'
import { FeedModel } from '@/models/feed.model'
import {
  VideoAddDanmakuDTO,
  VideoCreateDTO,
  VideoGetDanmakusList,
  VideoListItem,
} from '@mtobdvlb/shared-types'

export const VideoService = {
  list: async ({ page, pageSize }: { page: number; pageSize: number }) => {
    console.log(page, pageSize)

    // 直接用 $sample 随机取 pageSize 个视频
    return VideoModel.aggregate<VideoListItem>([
      { $match: { isOpen: true } },
      { $sample: { size: pageSize } }, // 随机抽取
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
      { $unwind: '$videostat' },
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
          url: 1,
        },
      },
    ])
  },
  create: async (body: VideoCreateDTO, userId: string) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    const res = await VideoModel.create({ ...body, userId })
    await VideoStatsModel.create({ videoId: res._id })
    await FeedModel.create({
      type: 'video',
      videoId: res._id,
      userId,
      content: res.title,
      publishedAt: res.publishedAt,
      isOpen: res.isOpen,
      commentsDisabled: res.commentsDisabled,
    })
  },
  getDanmakus: async (videoId: string) => {
    const video = await VideoModel.findById(videoId, { time: 1 }).lean()
    if (!video) return []

    const data = await DanmakuModel.find(
      {},
      {
        content: 1,
        position: 1,
        color: 1,
      }
    ).lean()

    const danmakus: VideoGetDanmakusList = []

    // 先把弹幕内容打平，保证至少能循环使用
    const baseDanmakus = data.map((d) => ({
      content: d.content!,
      position: d.position!,
      color: d.color!,
    }))

    const interval = 5 // 每 5 秒
    const countPerInterval = 5 // 每个区间至少 5 条

    const totalIntervals = Math.ceil(video.time / interval)

    for (let i = 0; i < totalIntervals; i++) {
      for (let j = 0; j < countPerInterval; j++) {
        const danmaku = baseDanmakus[Math.floor(Math.random() * baseDanmakus.length)]
        danmakus.push({
          ...danmaku!,
          time: Math.floor(Math.random() * interval) + i * interval,
          id: crypto.randomUUID(),
        })
      }
    }

    return danmakus
  },
  addDanmaku: async (body: VideoAddDanmakuDTO) => {
    const video = await VideoModel.findById(body.videoId)
    if (!video) throw new HttpError(404, MESSAGE.VIDEO_NOT_FOUND)
    await DanmakuModel.create(body)
  },
}
