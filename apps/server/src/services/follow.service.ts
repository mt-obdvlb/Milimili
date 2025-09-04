import { FollowModel } from '@/models'
import { HttpError } from '@/utils'

export const FollowService = {
  get: async ({ userId, followingId }: { userId: string; followingId: string }) => {
    const follow = await FollowModel.findOne({
      followerId: userId,
      followingId,
    })
    return {
      code: follow ? 0 : 1,
    }
  },
  create: async ({ userId, followingId }: { userId: string; followingId: string }) => {
    if (userId === followingId) {
      throw new HttpError(400, '不能关注自己')
    }
    const { code } = await FollowService.get({
      userId,
      followingId,
    })
    if (code === 0) {
      throw new HttpError(400, '已关注')
    }
    await FollowModel.create({
      followerId: userId,
      followingId,
    })
  },
  delete: async ({ userId, followingId }: { userId: string; followingId: string }) => {
    if (userId === followingId) {
      throw new HttpError(400, '不能取消关注自己')
    }
    await FollowModel.deleteOne({
      followerId: userId,
      followingId,
    })
  },
}
