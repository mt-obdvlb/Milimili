import { LikeDTO, LikeGetDTO, UnlikeDTO } from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { LikeModel } from '@/models'
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

export const LikeService = {
  like: async (userId: string, dto: LikeDTO) => {
    const query = resolveTarget(userId, dto)

    const exist = await LikeModel.findOne(query)
    if (!exist) {
      await LikeModel.create(query)
    }

    return 1
  },

  unlike: async (userId: string, dto: UnlikeDTO) => {
    const query = resolveTarget(userId, dto)
    await LikeModel.deleteOne(query)
    return 1
  },

  isLike: async (userId: string, dto: LikeGetDTO) => {
    const query = resolveTarget(userId, dto)
    const exist = await LikeModel.exists(query)
    return exist ? 1 : 0
  },
}
