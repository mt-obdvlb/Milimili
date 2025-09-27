import { FavoriteFolderModel, FollowModel, UserModel } from '@/models'
import { MESSAGE } from '@/constants'
import { comparePassword, hashPassword, HttpError, signToken } from '@/utils'
import redis from '@/utils/redis.util'
import { FeedModel } from '@/models/feed.model'
import { UserAtDTO, UserAtList, UserFindPasswordDTO } from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'

export const UserService = {
  loginByPassword: async (email: string, password: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    if (!user.password) throw new Error(MESSAGE.PASSWORD_ERROR)
    if (!(await comparePassword(password, user.password))) throw new Error(MESSAGE.PASSWORD_ERROR)
    return {
      accessToken: signToken({ id: user._id.toString() }, 'access'),
      refreshToken: signToken({ id: user._id.toString() }, 'refresh'),
    }
  },
  loginByCode: async (email: string, code: string) => {
    const key = `email_code:${email}`
    if (!(await redis.exists(key)) || (await redis.get(key)) !== code)
      throw new Error(MESSAGE.INVALID_CODE)
    let user = await UserModel.findOne({ email })
    if (!user) {
      await UserModel.create({ email })
      user = await UserModel.findOne({ email })
      await FavoriteFolderModel.create({
        userId: user!._id,
        type: 'default',
        name: '默认文件夹',
      })
      await FavoriteFolderModel.create({
        userId: user!._id,
        type: 'watch-later',
        name: '稍后再看',
      })
    }
    if (!user) throw new Error(MESSAGE.UNKNOWN_ERROR)

    return {
      accessToken: signToken({ id: user._id.toString() }, 'access'),
      refreshToken: signToken({ id: user._id.toString() }, 'refresh'),
    }
  },
  getInfoHome: async (id: string) => {
    const user = await UserModel.findById(id, {
      name: 1,
      avatar: 1,
      email: 1,
    })
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    const followings = await FollowModel.countDocuments({ followerId: id })
    const followers = await FollowModel.countDocuments({ followedId: id })
    const feeds = await FeedModel.countDocuments({ userId: id })
    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
      followings,
      followers,
      feeds,
    }
  },
  getInfo: async (id: string) => {
    const user = await UserModel.findById(id)
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    return {
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      id: user._id.toString(),
    }
  },
  getByEmail: async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) throw new HttpError(400, MESSAGE.USER_NOT_FOUND)
  },
  findPassword: async (body: UserFindPasswordDTO) => {
    const user = await UserModel.findOne({ email: body.email })
    if (!user) throw new HttpError(400, MESSAGE.USER_NOT_FOUND)
    const key = `email_code:${body.email}`
    if (!(await redis.exists(key)) || (await redis.get(key)) !== body.code)
      throw new Error(MESSAGE.INVALID_CODE)
    const hashed = await hashPassword(body.password)
    await UserModel.updateOne({ email: body.email }, { password: hashed })
  },
  getByName: async (name: string) => {
    const user = await UserModel.findOne({ name })
    if (!user) throw new HttpError(400, MESSAGE.USER_NOT_FOUND)
    return {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    }
  },
  getAtList: async (userId: string, { page, pageSize, keyword }: UserAtDTO) => {
    const skip = (page - 1) * pageSize

    // 查询条件
    const query: Record<string, unknown> = {}
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' }
    }

    // 总数
    const total = await UserModel.countDocuments(query)

    // 用户基础信息
    const users = await UserModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .select('_id name avatar')
      .lean()

    const userIds = users.map((u) => u._id as Types.ObjectId)

    // 每个用户的 followings 数量
    const followingCounts = await FollowModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { followerId: { $in: userIds } } },
      { $group: { _id: '$followerId', count: { $sum: 1 } } },
    ])

    const followingCountMap = new Map<string, number>(
      followingCounts.map((fc) => [fc._id.toString(), fc.count])
    )

    // 当前用户是否已关注这些人
    const followRelations = await FollowModel.find({
      followerId: new Types.ObjectId(userId),
      followingId: { $in: userIds },
    }).select('followingId')

    const followSet = new Set(followRelations.map((f) => f.followingId.toString()))

    let list: UserAtList = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      avatar: u.avatar,
      followings: followingCountMap.get(u._id.toString()) ?? 0,
      isFollow: followSet.has(u._id.toString()),
    }))

    // 排序规则：isFollow=true 的优先，然后 followings 倒序
    list = list.sort((a, b) => {
      if (a.isFollow !== b.isFollow) {
        return a.isFollow ? -1 : 1
      }
      return b.followings - a.followings
    })

    return { list, total }
  },
}
