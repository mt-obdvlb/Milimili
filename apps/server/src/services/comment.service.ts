import {
  CommentDeleteDTO,
  CommentDTO,
  CommentGetDTO,
  CommentGetList,
  CommentTargetType,
} from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { CommentModel, FeedModel, VideoStatsModel } from '@/models'
import { MESSAGE } from '@/constants'

const resolveTarget = (dto: {
  videoId?: string
  feedId?: string
  commentId?: string
}): { targetId: Types.ObjectId; targetType: CommentTargetType } => {
  if (dto.videoId) {
    return { targetId: new Types.ObjectId(dto.videoId), targetType: 'video' }
  }
  if (dto.feedId) {
    return { targetId: new Types.ObjectId(dto.feedId), targetType: 'feed' }
  }
  if (dto.commentId) {
    return { targetId: new Types.ObjectId(dto.commentId), targetType: 'comment' }
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
    const { targetId, targetType } = resolveTarget({ commentId, videoId, feedId })

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
    const { targetId, targetType } = resolveTarget({ commentId, videoId, feedId })

    if (targetType === 'video') {
      await VideoStatsModel.updateOne({ _id: targetId }, { $inc: { commentsCount: 1 } })
    }
    if (targetType === 'feed') {
      await FeedModel.updateOne({ _id: targetId }, { $inc: { commentsCount: 1 } })
    }

    if (commentId) {
      const comment = await CommentModel.findById(commentId)
      if (!comment) throw new Error(MESSAGE.COMMENT_NOT_FOUND)
      if (comment.targetType === 'comment') {
        await CommentModel.create({
          userId: new Types.ObjectId(userId),
          targetId: comment.targetId,
          targetType: 'comment',
          content: trimmed,
        })
        return
      }
    }

    // 创建评论
    await CommentModel.create({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
      content: trimmed,
    })
  },
  delete: async (userId: string, { id }: CommentDeleteDTO) => {
    const comment = await CommentModel.findOne({ _id: id, userId })
    if (!comment) throw new Error(MESSAGE.COMMENT_NOT_FOUND)
    await CommentModel.deleteOne({ _id: id })
    if (comment.targetType === 'video') {
      await VideoStatsModel.updateOne({ _id: comment.targetId }, { $inc: { commentsCount: -1 } })
    }
    if (comment.targetType === 'feed') {
      await FeedModel.updateOne({ _id: comment.targetId }, { $inc: { commentsCount: -1 } })
    }
  },
}
