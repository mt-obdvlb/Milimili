import {
  DanmakuModel,
  FavoriteFolderModel,
  FavoriteModel,
  HistoryModel,
  IFavorite,
  IFavoriteFolder,
  IFeed,
  IHistory,
  ITag,
  IUser,
  IVideo,
  IVideoStats,
  LikeModel,
  TagModel,
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
  VideoGetDetail,
  VideoGetWatchLaterDTO,
  VideoList,
  VideoListItem,
  VideoListSpaceDTO,
  VideoShareDTO,
} from '@mtobdvlb/shared-types'
import { FilterQuery, Types } from 'mongoose'
import { MessageService } from '@/services/message.service'
import { FeedService } from '@/services/feed.service'

export const VideoService = {
  list: async ({ page, pageSize }: { page: number; pageSize: number }): Promise<VideoList> => {
    console.log(page, pageSize)

    // 直接用 $sample 随机取 pageSize 个视频
    const allVideos = await VideoModel.aggregate<VideoListItem>([
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
          views: { $ifNull: ['$videostat.viewsCount', 0] },
          danmakus: { $ifNull: ['$videostat.danmakusCount', 0] },
          username: '$user.name',
          publishedAt: '$createdAt',
          userId: { $toString: '$user._id' },
          url: 1,
          likes: { $ifNull: ['$videostat.likesCount', 0] },
          shares: { $ifNull: ['$videostat.sharesCount', 0] },
          comments: { $ifNull: ['$videostat.commentsCount', 0] },
          favorites: { $ifNull: ['$videostat.favoritesCount', 0] },
        },
      },
    ])
    if (allVideos.length === 0) return []

    // 随机重复抽取 pageSize 个视频
    return Array.from({ length: pageSize }, (): VideoListItem => {
      const randomIndex = Math.floor(Math.random() * allVideos.length)
      return allVideos[randomIndex]!
    })
  },
  create: async (body: VideoCreateDTO, userId: string, videoId?: string) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    if (videoId) {
      const video = await VideoModel.findById(videoId)
      if (!video) throw new Error(MESSAGE.VIDEO_NOT_FOUND)
      await VideoModel.updateOne(
        { _id: video._id },
        {
          $set: {
            title: body.title,
            description: body.description,
            thumbnail: body.thumbnail,
            url: body.url,
          },
        }
      )
      return
    }
    const res = await VideoModel.create({ ...body, userId })
    await VideoStatsModel.create({ videoId: res._id })
    const video = await FeedModel.create({
      type: 'video',
      videoId: res._id,
      userId,
      content: res.title,
      publishedAt: res.publishedAt,
      isOpen: res.isOpen,
      commentsDisabled: res.commentsDisabled,
    })
    await MessageService.atMessage(userId, 'video', video._id, body.description)
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
  getDetail: async (videoId: string, userId: string): Promise<VideoGetDetail> => {
    // 1️⃣ 参数校验
    if (!Types.ObjectId.isValid(videoId)) throw new HttpError(400, 'videoId 非法')
    if (!Types.ObjectId.isValid(userId)) throw new HttpError(400, 'userId 非法')

    // 2️⃣ 查询视频并 populate 用户信息
    type PopulatedVideoDoc = Omit<IVideo, 'userId'> & {
      userId: { _id: Types.ObjectId; name?: string; avatar?: string }
    }
    const videoDoc = await VideoModel.findById(videoId)
      .populate('userId', 'name avatar')
      .lean<PopulatedVideoDoc>()
    if (!videoDoc) throw new HttpError(404, '视频不存在')

    // 3️⃣ 并行：更新统计 + upsert history
    const now = new Date()
    const statsPromise = VideoStatsModel.findOneAndUpdate(
      { videoId: videoDoc._id },
      { $inc: { viewsCount: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean<IVideoStats | null>()

    const historyPromise = HistoryModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        videoId: new Types.ObjectId(videoId),
      },
      {
        $set: { watchedAt: now },
        $setOnInsert: { duration: 0 },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean<IHistory | null>()

    const [statsDoc, historyDoc] = await Promise.all([statsPromise, historyPromise])

    const stats = {
      viewsCount: statsDoc?.viewsCount ?? 0,
      likesCount: statsDoc?.likesCount ?? 0,
      favoritesCount: statsDoc?.favoritesCount ?? 0,
      danmakusCount: statsDoc?.danmakusCount ?? 0,
      commentsCount: statsDoc?.commentsCount ?? 0,
      sharesCount: statsDoc?.sharesCount ?? 0,
    }

    // 4️⃣ 查询标签
    const tagDocs = await TagModel.find({ videoId: videoDoc._id }).lean<ITag[]>()
    const tags: string[] = tagDocs.map((t) => t.name).filter(Boolean)

    // 5️⃣ 构造 user
    const user = {
      id: videoDoc.userId._id.toHexString(),
      name: videoDoc.userId.name ?? '未知用户',
      avatar: videoDoc.userId.avatar ?? '',
    }

    // 6️⃣ 构造 video 返回
    const publishAtIso =
      videoDoc.publishedAt instanceof Date
        ? videoDoc.publishedAt.toISOString()
        : new Date(videoDoc.publishedAt).toISOString()

    const video = {
      id: videoDoc._id.toHexString(),
      thumbnail: videoDoc.thumbnail,
      description: videoDoc.description ?? '',
      title: videoDoc.title,
      duration: historyDoc?.duration ?? 0,
      time: videoDoc.time,
      publishAt: publishAtIso,
      views: stats.viewsCount,
      likes: stats.likesCount,
      comments: stats.commentsCount,
      favorites: stats.favoritesCount,
      danmakus: stats.danmakusCount,
      shares: stats.sharesCount,
      url: videoDoc.url,
      categoryId: videoDoc.categoryId.toString(),
    }

    return { user, tags, video }
  },

  share: async (userId: string, { videoId, content }: VideoShareDTO) => {
    const feed = await FeedModel.findOne({ videoId, type: 'video' }).lean<IFeed>()
    if (feed)
      await FeedService.transpont(userId, {
        feedId: feed._id.toString(),
        content: content ?? '转发视频',
      })
    await VideoStatsModel.findOneAndUpdate({ videoId }, { $inc: { sharesCount: 1 } }).exec()
  },
  listLike: async (userId: string): Promise<VideoList> => {
    const likes = await LikeModel.find({ userId, targetType: 'video' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    const videoIds = likes.map((like) => like.targetId)
    if (videoIds.length === 0) return []

    // 查询视频并关联用户信息
    const videos = await VideoModel.aggregate<VideoListItem>([
      {
        $match: {
          _id: { $in: videoIds.map((id) => new Types.ObjectId(id.toString())) },
        },
      },
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
      { $unwind: { path: '$videostat', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          title: 1,
          thumbnail: 1,
          time: 1,
          views: { $ifNull: ['$videostat.viewsCount', 0] },
          danmakus: { $ifNull: ['$videostat.danmakusCount', 0] },
          username: '$user.name',
          publishedAt: '$createdAt',
          userId: { $toString: '$user._id' },
          url: 1,
          likes: { $ifNull: ['$videostat.likesCount', 0] },
          shares: { $ifNull: ['$videostat.sharesCount', 0] },
          comments: { $ifNull: ['$videostat.commentsCount', 0] },
          favorites: { $ifNull: ['$videostat.favoritesCount', 0] },
        },
      },
    ])

    // 保持与点赞记录相同的顺序
    const videoMap = new Map(videos.map((v) => [v.id, v]))
    return videoIds
      .map((id) => videoMap.get(id.toString()))
      .filter((v): v is VideoListItem => Boolean(v))
  },
  listSpace: async ({
    userId,
    pageSize,
    page,
    sort,
  }: VideoListSpaceDTO): Promise<{ total: number; list: VideoList }> => {
    // 验证用户ID有效性
    if (!Types.ObjectId.isValid(userId)) {
      throw new HttpError(400, '无效的用户ID')
    }

    const userObjectId = new Types.ObjectId(userId)

    // 构建排序条件
    const sortOptions: Record<string, 1 | -1> = {}
    switch (sort) {
      case 'publishedAt':
        sortOptions['createdAt'] = -1 // 最新发布在前
        break
      case 'views':
        sortOptions['videostat.viewsCount'] = -1 // 最多观看在前
        break
      case 'favorites':
        sortOptions['videostat.favoritesCount'] = -1 // 最多收藏在前
        break
      default:
        sortOptions['createdAt'] = -1
    }

    // 计算分页偏移量
    const skip = (page - 1) * pageSize

    // 聚合查询视频列表及总数
    const [result] = await VideoModel.aggregate([
      {
        $facet: {
          // 分页查询视频数据
          list: [
            { $match: { userId: userObjectId, isOpen: true } },
            { $skip: skip },
            { $limit: pageSize },
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
            { $unwind: { path: '$videostat', preserveNullAndEmptyArrays: true } },
            { $sort: sortOptions },
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },
                title: 1,
                thumbnail: 1,
                time: 1,
                views: { $ifNull: ['$videostat.viewsCount', 0] },
                danmakus: { $ifNull: ['$videostat.danmakusCount', 0] },
                username: '$user.name',
                publishedAt: '$createdAt',
                userId: { $toString: '$user._id' },
                url: 1,
                categoryId: { $toString: '$categoryId' },
                likes: { $ifNull: ['$videostat.likesCount', 0] },
                shares: { $ifNull: ['$videostat.sharesCount', 0] },
                comments: { $ifNull: ['$videostat.commentsCount', 0] },
                favorites: { $ifNull: ['$videostat.favoritesCount', 0] },
              },
            },
          ],
          // 计算符合条件的总数量
          total: [{ $match: { userId: userObjectId, isOpen: true } }, { $count: 'count' }],
        },
      },
    ])

    // 处理查询结果
    const total = result.total[0]?.count || 0
    const list = result.list as VideoListItem[]

    return { total, list }
  },
  delete: async (videoId: string, userId: string) => {
    const video = await VideoModel.findOneAndDelete({ _id: videoId, userId })
    if (!video) throw new Error(MESSAGE.AUTH_ERROR)
    await VideoStatsModel.deleteOne({ videoId })
    await FeedModel.deleteMany({ videoId })
    await FavoriteModel.deleteMany({ videoId })
    await HistoryModel.deleteMany({ videoId })
  },
}
