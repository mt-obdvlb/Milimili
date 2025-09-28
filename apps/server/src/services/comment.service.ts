import { CommentDTO, CommentGetDTO, CommentGetList } from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { CommentModel } from '@/models'
import { MESSAGE } from '@/constants'

type TargetType = 'video' | 'feed' | 'comment'

const resolveTarget = (dto: {
  videoId?: string
  feedId?: string
  commentId?: string
}): { targetId: Types.ObjectId; targetType: TargetType } => {
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
  get: async ({ commentId, videoId, feedId, page = 1, pageSize = 20, sort }: CommentGetDTO) => {
    const { targetId, targetType } = resolveTarget({ commentId, videoId, feedId })

    const pageNum = Math.max(1, Math.floor(Number(page) || 1))
    const size = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 20)))
    const skip = (pageNum - 1) * size

    // 排序逻辑
    let sortStage: Record<string, 1 | -1>
    if (sort === 'new') {
      sortStage = { createdAt: -1 }
    } else {
      // 热度排序: likeCount + commentCount
      sortStage = { hotScore: -1, createdAt: -1 }
    }

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
          likeCount: { $ifNull: ['$likesCount', 0] },
          commentCount: { $ifNull: [{ $arrayElemAt: ['$replies.count', 0] }, 0] },
        },
      },
      // 热度分数
      {
        $addFields: {
          hotScore: { $add: ['$likeCount', '$commentCount'] },
        },
      },
      {
        $project: {
          id: { $toString: '$_id' },
          content: 1,
          createdAt: 1,
          likeCount: 1,
          commentCount: 1,
          user: {
            id: { $toString: '$user._id' },
            name: '$user.name',
            avatar: '$user.avatar',
          },
          hotScore: 1,
        },
      },
      { $sort: sortStage },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: size }],
        },
      },
    ])

    const metadata = (agg[0]?.metadata && agg[0].metadata[0]?.total) || 0
    const list = (agg[0]?.data || []) as CommentGetList

    return { total: metadata, list }
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

    // 创建评论
    await CommentModel.create({
      userId: new Types.ObjectId(userId),
      targetId,
      targetType,
      content: trimmed,
    })
  },
}
