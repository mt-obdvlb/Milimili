import { FeedModel } from '@/models/feed.model'
import { FollowModel } from '@/models/follow.model'
import { Types } from 'mongoose'
import { IUser, IVideo } from '@/models'
import { FeedRecentList } from '@mtobdvlb/shared-types'

export const FeedService = {
  recent: async (userId: string): Promise<FeedRecentList> => {
    const follows = await FollowModel.find({ followrId: userId }).select('followingId').lean()
    const followIds = follows.map((f) => new Types.ObjectId(f.followingId))

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
}
