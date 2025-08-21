import { FavoriteFolderModel, FollowModel, UserModel } from '@/models'
import { MESSAGE } from '@/constants'
import { comparePassword, signToken } from '@/utils'
import redis from '@/utils/redis.util'
import { FeedModel } from '@/models/feed.model'

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
        type: 'watch_later',
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
    const user = await UserModel.findById(id, 'name avatar')
    if (!user) throw new Error(MESSAGE.USER_NOT_FOUND)
    const { name: username, avatar } = user
    const following = await FollowModel.countDocuments({ followerId: id })
    const followers = await FollowModel.countDocuments({ followedId: id })
    const feeds = await FeedModel.countDocuments({ userId: id })
    return {
      username,
      avatar,
      following,
      followers,
      feeds,
    }
  },
}
