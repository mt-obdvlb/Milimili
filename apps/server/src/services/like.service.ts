import { LikeDTO, LikeGetDTO, UnlikeDTO } from '@mtobdvlb/shared-types'
import { type Model, Types } from 'mongoose'
import {
  CommentModel,
  FeedModel,
  IComment,
  IFeed,
  IVideoStats,
  LikeModel,
  MessageModel,
  VideoStatsModel,
} from '@/models'
import { MESSAGE } from '@/constants'

/**
 * 统一解析 targetId + targetType
 */
const resolveTarget = (
  userId: string,
  { videoId, feedId, commentId }: { videoId?: string; feedId?: string; commentId?: string }
) => {
  if (videoId) {
    return {
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(videoId),
      targetType: 'video' as const,
    }
  }
  if (feedId) {
    return {
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(feedId),
      targetType: 'feed' as const,
    }
  }
  if (commentId) {
    return {
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(commentId),
      targetType: 'comment' as const,
    }
  }
  throw new Error(MESSAGE.NOT_FOUND)
}

const targetModelMap = {
  comment: CommentModel,
  video: VideoStatsModel,
  feed: FeedModel,
} as const

// 从上面的映射提取出 targetType
type TargetType = keyof typeof targetModelMap

// 提取每个 Model 的文档类型
type TargetDocMap = {
  comment: IComment
  video: IVideoStats
  feed: IFeed
}

// 更新 likesCount 的函数
const updateLikesCount = async <T extends TargetType>(
  targetType: T,
  targetId: Types.ObjectId,
  inc: number
) => {
  console.log(targetId)
  if (targetType === 'video') {
    await VideoStatsModel.updateOne({ videoId: targetId }, { $inc: { likesCount: inc } })
    return
  }
  const model = targetModelMap[targetType] as unknown as Model<TargetDocMap[T]>
  await model.updateOne({ _id: targetId }, { $inc: { likesCount: inc } }, { upsert: true })
}

export const LikeService = {
  like: async (userId: string, dto: LikeDTO) => {
    const query = resolveTarget(userId, dto)
    await updateLikesCount(query.targetType, query.targetId, 1)
    const exist = await LikeModel.findOne(query)
    if (!exist) {
      await LikeModel.create(query)
      await MessageModel.create({
        userId: query.userId,
        fromUserId: query.userId,
        type: 'like',
        sourceId: query.targetId,
        sourceType: query.targetType,
      })
    }
  },

  unlike: async (userId: string, dto: UnlikeDTO) => {
    const query = resolveTarget(userId, dto)
    await updateLikesCount(query.targetType, query.targetId, -1)
    await LikeModel.deleteOne(query)
  },

  isLike: async (userId: string, dto: LikeGetDTO) => {
    const query = resolveTarget(userId, dto)
    const exist = await LikeModel.exists(query)
    return exist ? 0 : 1
  },
}
