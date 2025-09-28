import { FeedModel, IFeed } from '@/models/feed.model'
import { FollowModel } from '@/models/follow.model'
import { Types } from 'mongoose'
import { CommentModel, IUser, IVideo, IVideoState, VideoStatsModel } from '@/models'
import {
  FeedCreateDTO,
  FeedDeleteDTO,
  FeedFollowingList,
  FeedGetByIdDTO,
  FeedList,
  FeedListDTO,
  FeedRecentList,
  FeedTranspontDTO,
  FeedType,
} from '@mtobdvlb/shared-types'
import { MESSAGE } from '@/constants'

export const FeedService = {
  recent: async (userId: string): Promise<FeedRecentList> => {
    const follows = await FollowModel.find({ followrId: userId }).select('followingId').lean()
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
    const followings = await FollowModel.find({ followerId: userId }).select('followingId')
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
    await FeedModel.create({
      userId,
      type: 'image-text',
      content,
      title,
      mediaUrls: imageUrls,
    })
  },
  list: async (userId: string, { page, pageSize }: FeedListDTO) => {
    const followees = await FollowModel.find({ followerId: userId })
      .select('followingId')
      .lean<{ followingId: Types.ObjectId }[]>()

    const followeeIds = followees.map((f) => f.followingId.toString())
    followeeIds.push(userId) // 包含自己

    // 2️⃣ 查询 feed，并 populate userId 和 videoId
    const [feeds, total] = await Promise.all([
      FeedModel.find({
        userId: { $in: followeeIds.map((id) => new Types.ObjectId(id)) },
        isOpen: true,
      })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate<{ userId: { _id: Types.ObjectId; name: string; avatar: string } }>(
          'userId',
          'name avatar'
        )
        .populate<{ videoId?: IVideo }>('videoId')
        .lean<
          (IFeed & {
            userId: { _id: Types.ObjectId; name: string; avatar: string }
            videoId?: IVideo
          })[]
        >(),
      FeedModel.countDocuments({
        userId: { $in: followeeIds.map((id) => new Types.ObjectId(id)) },
        isOpen: true,
      }),
    ])

    // 3️⃣ 查询视频 stats
    const videoIds = feeds.filter((f) => !!f.videoId).map((f) => f.videoId._id)

    const videoStats = await VideoStatsModel.find({ videoId: { $in: videoIds } }).lean<
      IVideoState[]
    >()
    const videoStatsMap = new Map<string, IVideoState>()
    videoStats.forEach((vs) => videoStatsMap.set(vs.videoId.toString(), vs))

    // 4️⃣ 查询每条 feed 的最热门评论
    const feedIds = feeds.map((f) => f._id)
    const comments = await CommentModel.aggregate([
      { $match: { feedId: { $in: feedIds.map((id) => new Types.ObjectId(id)) } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      {
        $group: {
          _id: '$feedId',
          topComment: { $first: '$content' },
        },
      },
    ])

    const commentMap = new Map<string, string>()
    comments.forEach((c) => commentMap.set(c._id.toString(), c.topComment))

    // 5️⃣ 组装 FeedListItem
    const feedList: FeedList = feeds.map((f) => {
      const video = f.videoId
        ? {
            id: f.videoId._id.toString(),
            title: f.videoId.title,
            description: f.videoId.description,
            views: videoStatsMap.get(f.videoId._id.toString())?.views || 0,
            time: f.videoId.time,
            danmakus: videoStatsMap.get(f.videoId._id.toString())?.danmakus || 0,
            thumbnail: f.videoId.thumbnail,
            url: f.videoId.url,
          }
        : undefined

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
  getById: async (userId: string, { id }: FeedGetByIdDTO) => {
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
      }).lean<IVideoState>()
      video = {
        id: feed.videoId._id.toString(),
        title: feed.videoId.title,
        description: feed.videoId.description,
        views: videoStat?.views || 0,
        time: feed.videoId.time,
        danmakus: videoStat?.danmakus || 0,
        thumbnail: feed.videoId.thumbnail,
        url: feed.videoId.url,
      }
    }

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
    }
  },
  delete: async (userId: string, { id }: FeedDeleteDTO) => {
    const feed = await FeedModel.findOne({ _id: id, userId })
    if (!feed) throw new Error(MESSAGE.NOT_PERMISSION)

    await FeedModel.deleteOne({ _id: id })
  },
  transpont: async (userId: string, { feedId, content }: FeedTranspontDTO) => {
    const originalFeed = await FeedModel.findById(feedId)

    if (!originalFeed) throw new Error(MESSAGE.FEED_NOT_FOUND)

    const referenceId =
      originalFeed.type === 'reference' ? originalFeed.referenceId : originalFeed._id

    await FeedModel.create({
      content: content || originalFeed.content,
      mediaUrls: originalFeed.mediaUrls,
      likesCount: 0,
      commentsCount: 0,
      type: 'reference' as FeedType,
      commentsDisabled: originalFeed.commentsDisabled,
      isOpen: originalFeed.isOpen,
      publishedAt: new Date(),
      userId: new Types.ObjectId(userId),
      videoId: originalFeed.videoId,
      referenceId,
    })
  },
}
