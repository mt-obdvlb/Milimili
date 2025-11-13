import { FavoriteModel, HistoryModel, IHistory, UserModel, VideoModel } from '@/models'
import { Types } from 'mongoose'
import { HistoryAddDTO, HistoryGetDTO, HistoryList, HistoryListItem } from '@mtobdvlb/shared-types'

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
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const isToday = (d: Date) => d >= startOfToday
    const isYesterday = (d: Date) => d >= startOfYesterday && d < startOfToday
    const isLastWeek = (d: Date) => d >= weekAgo && d < startOfYesterday

    const result: HistoryList = {
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

      if (isToday(h.watchedAt)) result.todayList.push(item)
      else if (isYesterday(h.watchedAt)) result.yesterdayList.push(item)
      else if (isLastWeek(h.watchedAt)) result.lastWeekList.push(item)
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
  deleteBatch: async ({ userId, videoIds }: { userId: string; videoIds: string[] }) => {
    if (videoIds.length === 0) return
    await HistoryModel.deleteMany({
      userId,
      videoId: { $in: videoIds.map((id) => new Types.ObjectId(id)) },
    })
  },

  clear: async ({ userId }: { userId: string }) => {
    await HistoryModel.deleteMany({ userId })
  },

  get: async (userId: string, { watchAt, time, kw, from, to, pageSize, page }: HistoryGetDTO) => {
    // ---------- 辅助计算时间边界 ----------
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // ---------- 构建基本 match（针对 history collection） ----------
    const baseMatch: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    }

    // watchAt 过滤
    if (watchAt === 'today') {
      baseMatch.watchedAt = { $gte: startOfToday }
    } else if (watchAt === 'yesterday') {
      baseMatch.watchedAt = {
        $gte: startOfYesterday,
        $lt: startOfToday,
      }
    } else if (watchAt === 'week') {
      baseMatch.watchedAt = { $gte: weekAgo }
    } else if (watchAt === 'customer') {
      // custom range
      const range: Record<string, Date> = {}
      if (from) range.$gte = from
      if (to) range.$lte = to
      if (Object.keys(range).length > 0) {
        baseMatch.watchedAt = range
      }
    }
    // ---------- 视频时长区间：将分钟转换为秒（假设 video.time 为秒） ----------
    let minSeconds: number | undefined
    let maxSeconds: number | undefined
    if (time === '10') {
      maxSeconds = 10 * 60
    } else if (time === '10to30') {
      minSeconds = 10 * 60
      maxSeconds = 30 * 60
    } else if (time === '30to60') {
      minSeconds = 30 * 60
      maxSeconds = 60 * 60
    } else if (time === '60') {
      minSeconds = 60 * 60
    }

    // ---------- kw 正则（转义） ----------
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const kwRegex = kw ? new RegExp(escapeRegex(kw).replace(/\s+/g, '\\s*'), 'i') : undefined

    // ---------- 聚合管线 ----------
    // 使用模型的 collection.name 来保证正确的 collection 名称
    const videoColl = VideoModel.collection.name
    const userColl = UserModel.collection.name
    const favColl = FavoriteModel.collection.name

    const pipeline: unknown[] = []

    // 初始匹配（history）
    pipeline.push({ $match: baseMatch })

    // 关联 video
    pipeline.push({
      $lookup: {
        from: videoColl,
        localField: 'videoId',
        foreignField: '_id',
        as: 'video',
      },
    })
    pipeline.push({
      $unwind: {
        path: '$video',
        preserveNullAndEmptyArrays: false,
      },
    })

    // 关联 user
    pipeline.push({
      $lookup: {
        from: userColl,
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    })
    pipeline.push({
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: false,
      },
    })

    // 关联 favorites（判断是否已收藏）
    pipeline.push({
      $lookup: {
        from: favColl,
        let: { vid: '$video._id', uid: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$videoId', '$$vid'] }, { $eq: ['$userId', '$$uid'] }],
              },
            },
          },
          { $limit: 1 },
        ],
        as: 'favorite',
      },
    })

    // 添加 isFavorite 字段
    pipeline.push({
      $addFields: {
        isFavorite: { $gt: [{ $size: '$favorite' }, 0] },
      },
    })

    // kw 过滤（在 video.title 上）
    if (kwRegex) {
      pipeline.push({
        $match: {
          'video.title': { $regex: kwRegex },
        },
      })
    }

    // time 过滤（假设 video.time 单位为秒）
    if (minSeconds !== undefined && maxSeconds !== undefined) {
      pipeline.push({
        $match: {
          'video.time': {
            $gt: minSeconds,
            $lte: maxSeconds,
          },
        },
      })
    } else if (minSeconds !== undefined) {
      pipeline.push({
        $match: {
          'video.time': { $gt: minSeconds },
        },
      })
    } else if (maxSeconds !== undefined) {
      pipeline.push({
        $match: {
          'video.time': { $lte: maxSeconds },
        },
      })
    }

    // 排序，取 total 与分页数据
    pipeline.push({ $sort: { watchedAt: -1 } })

    const skipCount = Math.max(0, (page - 1) * pageSize)
    pipeline.push({
      $facet: {
        total: [{ $count: 'count' }],
        data: [{ $skip: skipCount }, { $limit: pageSize }],
      },
    })

    // ---------- 执行聚合 ----------
    type AggregatedDoc = {
      _id: Types.ObjectId
      watchedAt: Date
      duration: number
      video: {
        _id: Types.ObjectId
        title: string
        time: number
        thumbnail: string
        url?: string
      }
      user: {
        _id: Types.ObjectId
        name: string
      }
      isFavorite: boolean
    }

    const aggResult = await HistoryModel.aggregate<{
      total: { count: number }[]
      data: AggregatedDoc[]
    }>(pipeline as never).exec() // pipeline 类型在这里使用 any 转换以便清晰注释，但返回值用明确类型

    const total = aggResult?.[0]?.total?.[0]?.count ?? 0
    const data = aggResult?.[0]?.data ?? []

    // ---------- 映射为 HistoryGetList ----------
    const list = data.map((d) => ({
      title: d.video.title,
      thumbnail: d.video.thumbnail,
      time: d.video.time,
      username: d.user.name,
      userId: d.user._id.toString(),
      url: d.video.url ?? '',
      duration: d.duration,
      isFavorite: Boolean(d.isFavorite),
      watchAt: d.watchedAt.toISOString(),
      videoId: d.video._id.toString(),
    }))

    return { total, list }
  },
}
