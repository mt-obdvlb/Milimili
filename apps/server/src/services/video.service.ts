import {
  DanmakuModel,
  FavoriteFolderModel,
  FavoriteModel,
  HistoryModel,
  IFavorite,
  IFavoriteFolder,
  IHistory,
  IUser,
  IVideo,
  IVideoStats,
  UserModel,
  VideoModel,
  VideoStatsModel,
} from '@/models'
import { MESSAGE } from '@/constants'
import { HttpError } from '@/utils/http-error.util'
import { FeedModel } from '@/models/feed.model'
import {
  VideoAddDanmakuDTO,
  VideoCreateDTO,
  VideoGetDanmakusList,
  VideoGetWatchLaterDTO,
  VideoListItem,
} from '@mtobdvlb/shared-types'
import { FilterQuery, Types } from 'mongoose'

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
    await VideoStatsModel.updateOne(
      { videoId: body.videoId },
      { $inc: { danmakusCount: 1 } },
      { upsert: true }
    )
  },
  getWatchLater: async (body: VideoGetWatchLaterDTO, userId: string) => {
    const { kw, sort, type, time, addAt, from, to } = body

    const folder = await FavoriteFolderModel.findOne({
      userId: new Types.ObjectId(userId),
      type: 'watch_later',
    }).lean<IFavoriteFolder | null>()
    console.log(userId, body, folder)
    if (!folder) return []

    // 2) 构建 Favorite 查询（addAt 过滤作用在 Favorite.createdAt）
    const favoriteFilter: FilterQuery<IFavorite> = {
      userId: new Types.ObjectId(userId),
      folderId: folder._id,
    }

    const now = new Date()
    if (addAt === 'today') {
      favoriteFilter.createdAt = {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      }
    } else if (addAt === 'yesterday') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      favoriteFilter.createdAt = { $gte: start, $lt: end }
    } else if (addAt === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      favoriteFilter.createdAt = { $gte: weekAgo }
    } else if (addAt === 'customer' && from && to) {
      favoriteFilter.createdAt = { $gte: from, $lte: to }
    }

    // 3) 查询 Favorite（不分页），并按 sort 排序（按加入时间）
    const favorites = await FavoriteModel.find(favoriteFilter)
      .select('videoId createdAt _id')
      .lean<IFavorite[]>()

    if (!favorites || favorites.length === 0) return []

    // 根据 sort 调整 favorites 的顺序（latest: newest first; first: oldest first）
    favorites.sort((a, b) =>
      sort === 'latest'
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime()
    )

    // 保留 favorites 顺序并去重 videoId（防止重复收藏造成重复）
    const seen = new Set<string>()
    const orderedVideoIdStrings: string[] = []
    const favoriteMap = new Map<
      string,
      {
        favoriteId: string
        createdAt: Date
      }
    >() // videoId -> { favoriteId, createdAt }
    for (const f of favorites) {
      const vidStr = f.videoId.toString()
      if (!seen.has(vidStr)) {
        seen.add(vidStr)
        orderedVideoIdStrings.push(vidStr)
      }
      // 若存在多个 favorite（极少）以第一次出现的 createdAt 为准（已按 sort 排好序）
      if (!favoriteMap.has(vidStr))
        favoriteMap.set(vidStr, {
          favoriteId: f._id.toString(),
          createdAt: f.createdAt,
        })
    }

    if (orderedVideoIdStrings.length === 0) return []

    const orderedObjectIds = orderedVideoIdStrings.map((s) => new Types.ObjectId(s))

    // 4) 构建 Video 查询条件（_id in favorites + time + kw）
    const videoFilter: FilterQuery<IVideo> = { _id: { $in: orderedObjectIds } }

    // time 过滤 (单位为秒)
    if (time === '10') videoFilter.time = { $lt: 600 }
    else if (time === '10to30')
      videoFilter.time = {
        $gte: 600,
        $lt: 1800,
      }
    else if (time === '30to60')
      videoFilter.time = {
        $gte: 1800,
        $lt: 3600,
      }
    else if (time === '60') videoFilter.time = { $gte: 3600 }

    // kw: 同时匹配 video.title 或 username（先查 User）
    if (kw) {
      const regex = new RegExp(kw, 'i')
      const matchedUsers = await UserModel.find({ username: { $regex: regex } })
        .select('_id')
        .lean<IUser[]>()
      const matchedUserIds = matchedUsers.map((u) => u._id)
      videoFilter.$or = [{ title: { $regex: regex } }, { userId: { $in: matchedUserIds } }]
    }

    // 5) 查询视频并 populate username（保证拿到 username）
    type PopulatedVideo = IVideo & {
      userId: { _id: Types.ObjectId; name: string }
    }
    const videos = await VideoModel.find(videoFilter)
      .populate<{
        userId: { _id: Types.ObjectId; name: string }
      }>('userId', 'name')
      .lean<PopulatedVideo[]>()
      .exec()

    if (!videos || videos.length === 0) return []

    const videoIdsForMeta = videos.map((v) => v._id)

    // 6) 查询统计（VideoStats）
    const stats = await VideoStatsModel.find({ videoId: { $in: videoIdsForMeta } }).lean<
      IVideoStats[]
    >()
    const statsMap = new Map<string, IVideoStats>(stats.map((s) => [s.videoId.toString(), s]))

    // 7) 查询用户历史（判断 watched）
    const histories = await HistoryModel.find({
      userId: new Types.ObjectId(userId),
      videoId: { $in: videoIdsForMeta },
    })
      .select('videoId duration')
      .lean<IHistory[]>()
    const historyMap = new Map<string, IHistory>(histories.map((h) => [h.videoId.toString(), h]))

    // 8) 组装结果
    let result = videos.map((v) => {
      const idStr = v._id.toString()
      const stat = statsMap.get(idStr)
      const history = historyMap.get(idStr)
      const watched = history ? history.duration >= v.time * 0.98 : false
      const fav = favoriteMap.get(idStr)
      return {
        data: {
          id: idStr,
          title: v.title,
          thumbnail: v.thumbnail,
          time: v.time,
          views: stat?.viewsCount ?? 0,
          danmakus: stat?.danmakusCount ?? 0,
          username: v.userId?.name ?? '',
          publishedAt: v.createdAt.toISOString(),
          userId: v.userId?._id.toString() ?? '',
          url: v.url,
          favoriteId: fav?.favoriteId ?? '',
        },
        watched,
      }
    })

    // 9) 根据 DTO.type 过滤（not_watched -> 只保留未看完）
    if (type === 'not_watched') {
      result = result.filter((r) => !r.watched)
    }

    // 10) 最终按 favorites 的顺序排序（保证返回顺序与用户“加入收藏”的顺序一致）
    const indexMap = new Map<string, number>(orderedVideoIdStrings.map((id, idx) => [id, idx]))
    result.sort((a, b) => (indexMap.get(a.data.id) ?? 0) - (indexMap.get(b.data.id) ?? 0))

    return result.map((item) => item.data)
  },
}
