import { HistoryModel, IHistory } from '@/models'
import { HistoryListItem, HistoryListVO } from '@/vos/history/list.vo'
import { Types } from 'mongoose'
import { HistoryAddDTO } from '@/dtos/history/add.dto'

type PopulatedHistory = Omit<IHistory, 'videoId' | 'userId'> & {
  videoId: {
    _id: Types.ObjectId
    title: string
    time: number
    thumbnail: string
  }
  userId: {
    _id: Types.ObjectId
    name: string
  }
}

export const HistoryService = {
  list: async ({ userId, pageSize, page }: { userId: string; page: number; pageSize: number }) => {
    const histories = await HistoryModel.find({ userId })
      .sort({ watchedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: 'videoId',
        select: 'title time thumbnail',
      })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .lean<PopulatedHistory[]>()

    const now = new Date()
    const today = now.toDateString()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const result: HistoryListVO = {
      todayList: [],
      yesterdayList: [],
      lastWeekList: [],
      olderList: [],
    }

    histories.forEach((h) => {
      const video = h.videoId
      const user = h.userId

      const item: HistoryListItem = {
        duration: h.duration,
        watchAt: h.watchedAt.toISOString(),
        video: {
          id: video._id.toString(),
          title: video.title,
          time: video.time,
          thumbnail: video.thumbnail,
        },
        user: {
          id: user._id.toString(),
          name: user.name,
        },
      }

      const watchDay = new Date(h.watchedAt).toDateString()
      if (watchDay === today) result.todayList.push(item)
      else if (watchDay === yesterday) result.yesterdayList.push(item)
      else if (new Date(h.watchedAt) >= weekAgo) result.lastWeekList.push(item)
      else result.olderList.push(item)
    })

    return result
  },
  add: async (body: HistoryAddDTO) => {
    await HistoryModel.updateOne(
      { userId: body.userId, videoId: body.videoId },
      {
        watchedAt: new Date(),
        duration: body.duration,
      },
      { upsert: true }
    )
  },
}
