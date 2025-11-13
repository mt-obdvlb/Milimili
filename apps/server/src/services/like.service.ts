import { LikeDTO, LikeGetDTO, UnlikeDTO } from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import {
  CommentModel,
  FeedModel,
  LikeModel,
  MessageModel,
  VideoModel,
  VideoStatsModel,
} from '@/models'
import { MESSAGE } from '@/constants'
import { HttpError } from '@/utils'

/**
 * 统一解析目标对象
 */
const resolveTarget = async (
  { videoId, feedId, commentId }: { videoId?: string; feedId?: string; commentId?: string },
  count?: number
) => {
  if (videoId) {
    const video = await VideoModel.findById(videoId).lean()
    if (!video) throw new HttpError(400, MESSAGE.VIDEO_NOT_FOUND)
    if (count)
      await VideoStatsModel.updateOne(
        { videoId: new Types.ObjectId(videoId) },
        { $inc: { likesCount: count } }
      )

    return {
      targetOwnerId: video.userId,
      targetId: video._id,
      targetType: 'video' as const,
    }
  }

  if (feedId) {
    const feed = await FeedModel.findById(feedId).lean()
    if (!feed) throw new HttpError(400, MESSAGE.FEED_NOT_FOUND)
    if (count)
      await FeedModel.updateOne(
        { _id: new Types.ObjectId(feedId) },
        { $inc: { likesCount: count } }
      )

    return {
      targetOwnerId: feed.userId,
      targetId: feed._id,
      targetType: 'feed' as const,
    }
  }

  if (commentId) {
    const comment = await CommentModel.findById(commentId).lean()
    if (!comment) throw new HttpError(400, MESSAGE.COMMENT_NOT_FOUND)
    if (count)
      await CommentModel.updateOne(
        { _id: new Types.ObjectId(commentId) },
        { $inc: { likesCount: count } }
      )

    return {
      targetOwnerId: comment.userId,
      targetId: comment._id,
      targetType: 'comment' as const,
    }
  }

  throw new HttpError(400, MESSAGE.NOT_FOUND)
}

export const LikeService = {
  like: async (userId: string, dto: LikeDTO) => {
    const { targetId, targetType, targetOwnerId } = await resolveTarget(dto, 1)

    const exist = await LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
    })

    if (exist) throw new HttpError(400, MESSAGE.LIKE_EXIST)

    await LikeModel.create({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
    })

    if (userId !== String(targetOwnerId)) {
      await MessageModel.create({
        userId: targetOwnerId, // 接收者（被点赞者）
        fromUserId: new Types.ObjectId(userId), // 发送者（点赞者）
        type: 'like',
        sourceId: targetId,
        sourceType: targetType,
      })
    }
  },

  unlike: async (userId: string, dto: UnlikeDTO) => {
    const { targetId, targetType } = await resolveTarget(dto, -1)
    await LikeModel.deleteOne({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
    })
  },

  isLike: async (userId: string, dto: LikeGetDTO) => {
    const { targetId, targetType } = await resolveTarget(dto)
    const exist = await LikeModel.exists({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
    })
    return exist ? 0 : 1 // 0=已喜欢, 1=未喜欢
  },
}
