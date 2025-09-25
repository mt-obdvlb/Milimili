import { FeedModel } from '@/models/feed.model'
import { FollowModel } from '@/models/follow.model'
import { Types } from 'mongoose'
import { IUser, IVideo } from '@/models'
import { FeedFollowingList, FeedRecentList } from '@mtobdvlb/shared-types'

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
}
