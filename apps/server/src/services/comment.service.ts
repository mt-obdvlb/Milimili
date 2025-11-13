import {
  CommentDeleteDTO,
  CommentDTO,
  CommentGetDTO,
  CommentGetList,
  CommentTargetType,
} from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { CommentModel, FeedModel, MessageModel, VideoModel, VideoStatsModel } from '@/models'
import { MESSAGE } from '@/constants'
import { MessageService } from '@/services/message.service'

const resolveTarget = async (
  dto: {
    videoId?: string
    feedId?: string
    commentId?: string
  },
  add?: number
): Promise<{
  targetId: Types.ObjectId
  targetType: CommentTargetType
  targetUserId: Types.ObjectId
}> => {
  // 对视频评论
  if (dto.videoId) {
    const video = await VideoModel.findById(dto.videoId).lean()
    if (!video) throw new Error(MESSAGE.VIDEO_NOT_FOUND)
    if (add) await VideoStatsModel.updateOne({ _id: video._id }, { $inc: { commentsCount: add } })
    return {
      targetId: new Types.ObjectId(dto.videoId),
      targetType: 'video',
      targetUserId: new Types.ObjectId(video.userId),
    }
  }

  // 对动态评论
  if (dto.feedId) {
    const feed = await FeedModel.findById(dto.feedId).lean()
    if (!feed) throw new Error(MESSAGE.FEED_NOT_FOUND)
    if (add) await FeedModel.updateOne({ _id: feed._id }, { $inc: { commentsCount: add } })
    return {
      targetId: new Types.ObjectId(dto.feedId),
      targetType: 'feed',
      targetUserId: new Types.ObjectId(feed.userId),
    }
  }

  // 对评论回复
  if (dto.commentId) {
    const comment = await CommentModel.findById(dto.commentId).lean()
    if (!comment) throw new Error(MESSAGE.COMMENT_NOT_FOUND)
    return {
      targetId: new Types.ObjectId(dto.commentId),
      targetType: 'comment',
      targetUserId: new Types.ObjectId(comment.userId),
    }
  }

  throw new Error(MESSAGE?.NOT_FOUND ?? 'target not found')
}

export const CommentService = {
  /**
   * 获取评论列表或某条评论的回复列表（分页）
   * 返回结构：
   * { total, list: [{ id, content, user: { id, name, avatar }, createdAt, commentCount, likeCount }] }
   */
  get: async ({
    commentId,
    videoId,
    feedId,
    page = 1,
    pageSize = 20,
    sort,
  }: CommentGetDTO): Promise<{ total: number; list: CommentGetList }> => {
    const { targetId, targetType } = await resolveTarget({ commentId, videoId, feedId })

    const pageNum = Math.max(1, Math.floor(Number(page) || 1))
    const size = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 20)))
    const skip = (pageNum - 1) * size

    // 排序逻辑
    const sortStage: Record<string, 1 | -1> =
      sort === 'new' ? { createdAt: -1 } : { hotScore: -1, createdAt: -1 }

    const agg = await CommentModel.aggregate([
      { $match: { targetId, targetType } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'comments',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$targetType', 'comment'] }, { $eq: ['$targetId', '$$id'] }],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'replies',
        },
      },
      {
        $addFields: {
          likes: { $ifNull: ['$likesCount', 0] },
          comments: { $ifNull: [{ $arrayElemAt: ['$replies.count', 0] }, 0] },
        },
      },
      { $addFields: { hotScore: { $add: ['$likes', '$comments'] } } },
      {
        $project: {
          id: { $toString: '$_id' },
          content: 1,
          createdAt: 1,
          likes: 1,
          comments: 1,
          type: '$targetType',
          user: {
            id: { $toString: { $ifNull: ['$user._id', ''] } },
            name: { $ifNull: ['$user.name', ''] },
            avatar: { $ifNull: ['$user.avatar', ''] },
          },
          hotScore: 1,
        },
      },
      { $sort: sortStage },
      { $facet: { metadata: [{ $count: 'total' }], data: [{ $skip: skip }, { $limit: size }] } },
    ])

    const total = agg[0]?.metadata[0]?.total || 0
    const list = (agg[0]?.data || []) as CommentGetList

    return { total, list }
  },
  /**
   * 发布评论（可对 video/feed 评论或对 comment 回复）
   * 返回单条评论的列表项结构（与 get 返回的 list 单项相同）
   */
  comment: async (userId: string, { commentId, videoId, feedId, content }: CommentDTO) => {
    // 基本校验
    const trimmed = String(content ?? '').trim()
    if (!trimmed) throw new Error(MESSAGE.INVALID_PARAMS)

    // 解析 target
    const { targetId, targetType, targetUserId } = await resolveTarget(
      {
        commentId,
        videoId,
        feedId,
      },
      1
    )

    if (commentId) {
      const comment = await CommentModel.findById(commentId)
      if (!comment) throw new Error(MESSAGE.COMMENT_NOT_FOUND)
      if (comment.targetType === 'comment') {
        const message = await CommentModel.create({
          userId: new Types.ObjectId(userId),
          targetId: comment.targetId,
          targetType: 'comment',
          content: trimmed,
        })
        await MessageService.atMessage(userId, 'comment', message._id, trimmed)
        await MessageModel.create({
          userId: targetUserId,
          sourceType: targetType,
          fromUserId: userId,
          type: 'reply',
          content: trimmed,
          sourceId: targetId,
        })
        if (message.targetType === 'video')
          await VideoStatsModel.updateOne({ _id: message.targetId }, { $inc: { commentsCount: 1 } })
        if (message.targetType === 'feed')
          await FeedModel.updateOne({ _id: message.targetId }, { $inc: { commentsCount: 1 } })
        return
      }
    }

    // 创建评论
    const message = await CommentModel.create({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
      content: trimmed,
    })
    await MessageService.atMessage(userId, 'comment', message._id, trimmed)
    await MessageModel.create({
      userId: targetUserId,
      sourceType: targetType,
      fromUserId: userId,
      type: 'reply',
      content: trimmed,
      sourceId: targetId,
    })
  },
  delete: async (userId: string, { id }: CommentDeleteDTO): Promise<void> => {
    // 查找评论，确保是本人
    const comment = await CommentModel.findOne({ _id: id, userId })
    if (!comment) throw new Error(MESSAGE.COMMENT_NOT_FOUND)

    // 删除主评论
    await CommentModel.deleteOne({ _id: id })

    // 更新目标计数
    if (comment.targetType === 'video') {
      await VideoStatsModel.updateOne({ _id: comment.targetId }, { $inc: { commentsCount: -1 } })
    } else if (comment.targetType === 'feed') {
      await FeedModel.updateOne({ _id: comment.targetId }, { $inc: { commentsCount: -1 } })
    }

    // 查找所有子评论（回复当前评论的）
    const subComments = await CommentModel.find({ targetType: 'comment', targetId: comment._id })

    // 递归删除子评论（这里直接引用 CommentService.delete 避免 this 丢失）
    await Promise.all(
      subComments.map((cm) =>
        CommentService.delete(cm.userId.toString(), { id: cm._id.toString() })
      )
    )
  },
}
