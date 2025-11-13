import { FeedModel, IFeed } from '@/models/feed.model'
import { FollowModel } from '@/models/follow.model'
import { Types } from 'mongoose'
import { CommentModel, IUser, IVideo, IVideoStats, LikeModel, VideoStatsModel } from '@/models'
import {
  FeedCreateDTO,
  FeedDeleteDTO,
  FeedFollowingList,
  FeedGetById,
  FeedGetByIdDTO,
  FeedList,
  FeedListDTO,
  FeedListLikeTranspontDTO,
  FeedListLikeTranspontItem,
  FeedListLikeTranspontList,
  FeedRecentList,
  FeedTranspontDTO,
  FeedType,
} from '@mtobdvlb/shared-types'
import { MESSAGE } from '@/constants'
import { MessageService } from '@/services/message.service'

type PopulatedFeed = IFeed & {
  userId: { _id: Types.ObjectId; name: string; avatar: string }
  videoId?: IVideo | Types.ObjectId
}

interface CommentAggResult {
  _id: Types.ObjectId
  topComment: string
}

export const FeedService = {
  recent: async (userId: string): Promise<FeedRecentList> => {
    const follows = await FollowModel.find({ followerId: new Types.ObjectId(userId) })
      .select('followingId')
      .lean()
    const followIds = follows.map((f) => new Types.ObjectId(f.followingId))
    followIds.push(new Types.ObjectId(userId))
    if (followIds.length === 0) return []

    const feeds = await FeedModel.find({
      userId: { $in: followIds },
      type: 'video',
      videoId: { $exists: true, $ne: null },
    })
      .sort({ publishedAt: -1 })
      .limit(20)
      .populate<{
        userId: Pick<IUser, '_id' | 'name' | 'avatar'>
      }>('userId', '_id name avatar')
      .populate<{
        videoId: Pick<IVideo, '_id' | 'title' | 'publishedAt' | 'thumbnail'>
      }>('videoId', '_id title publishedAt thumbnail')
      .lean()

    return feeds.map((feed) => ({
      id: feed._id.toString(),
      video: {
        id: (feed.videoId as IVideo)._id.toString(),
        title: (feed.videoId as IVideo).title,
        publishedAt: (feed.videoId as IVideo).publishedAt.toISOString(),
        thumbnail: (feed.videoId as IVideo).thumbnail,
      },
      user: {
        id: (feed.userId as IUser)._id.toString(),
        name: (feed.userId as IUser).name,
        avatar: (feed.userId as IUser).avatar,
      },
    }))
  },
  followingList: async (userId: string) => {
    // 1. 找到关注的人
    const followings = await FollowModel.find({ followerId: new Types.ObjectId(userId) }).select(
      'followingId'
    )
    const followingIds = followings.map((f) => f.followingId)

    if (followingIds.length === 0) return []

    // 2. 聚合找到最近发布动态的 20 个关注用户
    return (await FeedModel.aggregate([
      { $match: { userId: { $in: followingIds.map((id) => new Types.ObjectId(id)) } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$userId', latestFeed: { $first: '$$ROOT' } } },
      { $sort: { 'latestFeed.createdAt': -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: { $toString: '$user._id' },
          name: '$user.name',
          avatar: '$user.avatar',
        },
      },
    ])) as FeedFollowingList // 强制类型断言，确保返回类型
  },
  create: async (userId: string, { title, imageUrls, content }: FeedCreateDTO) => {
    const feed = await FeedModel.create({
      userId,
      type: 'image-text',
      content,
      title,
      mediaUrls: imageUrls,
    })
    await MessageService.atMessage(userId, 'feed', feed._id, content)
  },
  list: async (
    currentUserId: string,
    { page = 1, pageSize = 20, userId: targetUserId, type = 'all' }: FeedListDTO
  ): Promise<{ list: FeedList; total: number }> => {
    const pageNum = Math.max(1, Math.floor(Number(page) || 1))
    const size = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 20)))

    const baseQuery: Record<string, unknown> = { isOpen: true }

    if (targetUserId) {
      // 只查某个用户
      baseQuery.userId = new Types.ObjectId(targetUserId)
    } else {
      // 查关注的人 + 自己
      const followees = await FollowModel.find({
        followerId: new Types.ObjectId(currentUserId),
      })
        .select('followingId')
        .lean<{ followingId: Types.ObjectId }[]>()

      const followeeIds = followees.map((f) => f.followingId)
      followeeIds.push(new Types.ObjectId(currentUserId))

      baseQuery.userId = { $in: followeeIds }
    }

    if (type !== 'all') {
      baseQuery.type = type
    }

    // feed + total
    const [feeds, total] = await Promise.all([
      FeedModel.find(baseQuery)
        .sort({ publishedAt: -1 })
        .skip((pageNum - 1) * size)
        .limit(size)
        .populate<{ userId: { _id: Types.ObjectId; name: string; avatar: string } }>(
          'userId',
          'name avatar'
        )
        .populate<{ videoId?: IVideo }>('videoId')
        .lean<PopulatedFeed[]>(),
      FeedModel.countDocuments(baseQuery),
    ])

    // 视频统计
    const videoIds: Types.ObjectId[] = feeds
      .filter(
        (f): f is PopulatedFeed & { videoId: IVideo } =>
          !!f.videoId && (f.videoId as IVideo)._id !== undefined
      )
      .map((f) => (f.videoId as IVideo)._id)

    const videoStats: IVideoStats[] = videoIds.length
      ? await VideoStatsModel.find({ videoId: { $in: videoIds } }).lean<IVideoStats[]>()
      : []

    const videoStatsMap = new Map<string, IVideoStats>()
    videoStats.forEach((vs) => videoStatsMap.set(vs.videoId.toString(), vs))

    // 每条 feed 的热门评论
    const feedIds = feeds.map((f) => f._id)
    const comments: CommentAggResult[] =
      feedIds.length > 0
        ? await CommentModel.aggregate<CommentAggResult>([
            { $match: { feedId: { $in: feedIds } } },
            { $sort: { likesCount: -1, createdAt: -1 } },
            {
              $group: {
                _id: '$feedId',
                topComment: { $first: '$content' },
              },
            },
          ])
        : []

    const commentMap = new Map<string, string>()
    comments.forEach((c) => commentMap.set(c._id.toString(), c.topComment))

    // 组装返回结果
    const feedList: FeedList = feeds.map((f) => {
      let video: FeedList[number]['video'] | undefined

      if (f.videoId && (f.videoId as IVideo)._id) {
        const v = f.videoId as IVideo
        const stats = videoStatsMap.get(v._id.toString())
        video = {
          id: v._id.toString(),
          title: v.title,
          description: v.description,
          views: stats?.viewsCount ?? 0,
          time: v.time,
          danmakus: stats?.danmakusCount ?? 0,
          thumbnail: v.thumbnail,
          url: v.url,
        }
      }

      return {
        id: f._id.toString(),
        title: f.title,
        content: f.content,
        video,
        user: {
          id: f.userId._id.toString(),
          name: f.userId.name,
          avatar: f.userId.avatar,
        },
        comment: commentMap.get(f._id.toString()),
        images: f.mediaUrls,
        likes: f.likesCount,
        comments: f.commentsCount,
        publishedAt: f.publishedAt.toISOString(),
        type: f.type,
        referenceId: f.referenceId?.toString(),
      }
    })

    return { list: feedList, total }
  },
  getById: async ({ id }: FeedGetByIdDTO): Promise<FeedGetById> => {
    // 1️⃣ 查询 feed 并 populate userId 和 videoId
    const feed = await FeedModel.findById(id)
      .populate<{
        userId: { _id: Types.ObjectId; name: string; avatar: string }
      }>('userId', 'name avatar')
      .populate<{ videoId?: IVideo }>('videoId')
      .lean<
        IFeed & {
          userId: { _id: Types.ObjectId; name: string; avatar: string }
          videoId?: IVideo
        }
      >()

    if (!feed) throw new Error(MESSAGE.FEED_NOT_FOUND)

    // 2️⃣ 查询视频 stats
    let video
    if (feed.videoId) {
      const videoStat = await VideoStatsModel.findOne({
        videoId: feed.videoId._id,
      }).lean<IVideoStats>()
      video = {
        id: feed.videoId._id.toString(),
        title: feed.videoId.title,
        description: feed.videoId.description,
        views: videoStat?.viewsCount || 0,
        time: feed.videoId.time,
        danmakus: videoStat?.danmakusCount || 0,
        thumbnail: feed.videoId.thumbnail,
        url: feed.videoId.url,
      }
    }

    const references = await FeedModel.countDocuments({
      referenceId: feed._id,
    }).lean()

    // 3️⃣ 查询最热门评论
    // 4️⃣ 组装返回
    return {
      id: feed._id.toString(),
      title: feed.title,
      content: feed.content,
      video,
      user: {
        id: feed.userId._id.toString(),
        name: feed.userId.name,
        avatar: feed.userId.avatar,
      },
      images: feed.mediaUrls?.length ? feed.mediaUrls : undefined,
      likes: feed.likesCount,
      comments: feed.commentsCount,
      publishedAt: feed.publishedAt.toISOString(),
      type: feed.type,
      referenceId: feed.referenceId?.toString(),
      references,
    }
  },
  delete: async (userId: string, { id }: FeedDeleteDTO) => {
    const feed = await FeedModel.findOne({ _id: id, userId })
    if (!feed) throw new Error(MESSAGE.FEED_NOT_FOUND)

    await FeedModel.deleteOne({ _id: id })
  },
  transpont: async (userId: string, { feedId, content }: FeedTranspontDTO) => {
    const originalFeed = await FeedModel.findById(feedId)

    if (!originalFeed) throw new Error(MESSAGE.FEED_NOT_FOUND)
    await MessageService.atMessage(userId, 'feed', new Types.ObjectId(feedId), content)
    let targetFeed = originalFeed
    if (originalFeed.type === 'reference') {
      const feed = await FeedModel.findById(originalFeed.referenceId)
      if (!feed) throw new Error(MESSAGE.FEED_NOT_FOUND)
      targetFeed = feed
    }

    await FeedModel.create({
      content: content,
      type: 'reference' as FeedType,
      isOpen: originalFeed.isOpen,
      publishedAt: new Date(),
      userId: new Types.ObjectId(userId),
      referenceId: targetFeed._id,
    })
    if (targetFeed.type === 'video') {
      await VideoStatsModel.updateOne({ videoId: targetFeed.videoId }, { $inc: { sharesCount: 1 } })
    }
  },
  listLikeTranspont: async (
    feedId: string,
    { pageSize, page }: FeedListLikeTranspontDTO
  ): Promise<{ total: number; list: FeedListLikeTranspontList }> => {
    const feedObjectId = new Types.ObjectId(feedId)
    const skip = (page - 1) * pageSize

    // 1. 查询 likes（针对 feed）
    const likes = await LikeModel.aggregate<FeedListLikeTranspontItem & { createdAt: Date }>([
      { $match: { targetId: feedObjectId, targetType: 'feed' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user' } },
      {
        $project: {
          type: { $literal: 'like' as const },
          createdAt: 1,
          user: {
            id: '$user._id',
            name: '$user.name',
            avatar: '$user.avatar',
          },
        },
      },
    ]).exec()

    // 2. 查询转发（referenceId 指向该 feed 的 feed）
    const transponts = await FeedModel.aggregate<FeedListLikeTranspontItem & { createdAt: Date }>([
      { $match: { referenceId: feedObjectId } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user' } },
      {
        $project: {
          type: { $literal: 'transpont' as const },
          createdAt: 1,
          user: {
            id: '$user._id',
            name: '$user.name',
            avatar: '$user.avatar',
          },
        },
      },
    ]).exec()

    // 3. 合并 + 排序
    const merged = [...likes, ...transponts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    // 4. 分页
    const paginated = merged.slice(skip, skip + pageSize)

    // 5. 输出格式
    const list: FeedListLikeTranspontList = paginated.map((item) => ({
      type: item.type,
      user: {
        id: item.user.id.toString(),
        name: item.user.name,
        avatar: item.user.avatar,
      },
    }))

    return {
      total: likes.length + transponts.length,
      list,
    }
  },
}
