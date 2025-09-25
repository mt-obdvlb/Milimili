import { FavoriteFolderModel, FollowModel, UserModel } from '@/models'
import { MESSAGE } from '@/constants'
import { comparePassword, hashPassword, HttpError, signToken } from '@/utils'
import redis from '@/utils/redis.util'
import { FeedModel } from '@/models/feed.model'
import { UserFindPasswordDTO } from '@mtobdvlb/shared-types'

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
}
