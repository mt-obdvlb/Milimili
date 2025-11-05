import { FollowModel, UserModel } from '@/models'
import { HttpError } from '@/utils'
import { FollowList, FollowListDTO } from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'

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
  list: async ({
    pageSize,
    page,
    userId,
    type,
  }: FollowListDTO): Promise<{ total: number; list: FollowList }> => {
    const query =
      type === 'following'
        ? { followerId: new Types.ObjectId(userId) } // 我关注了谁
        : { followingId: new Types.ObjectId(userId) } // 谁关注了我

    const total = await FollowModel.countDocuments(query)

    const follows = await FollowModel.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean()

    // 提取所有 userId
    const userIds =
      type === 'following' ? follows.map((f) => f.followingId) : follows.map((f) => f.followerId)

    // 批量查 user
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select('_id name avatar')
      .lean()

    // 建立 Map 方便快速匹配
    const userMap = new Map(users.map((u) => [u._id.toString(), u]))

    const list: FollowList = follows
      .map((item) => {
        const targetId =
          type === 'following' ? item.followingId.toString() : item.followerId.toString()
        const user = userMap.get(targetId)
        return user
          ? {
              user: {
                id: user._id.toString(),
                name: user.name,
                avatar: user.avatar,
              },
            }
          : null
      })
      .filter((x): x is { user: { id: string; name: string; avatar: string } } => !!x)

    return { total, list }
  },
}
