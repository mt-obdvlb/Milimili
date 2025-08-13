import { UserModel } from '@/models'
import { MESSAGE } from '@/constants'
import { comparePassword, signToken } from '@/utils'
import redis from '@/utils/redis.util'

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
    }
    if (!user) throw new Error(MESSAGE.UNKNOWN_ERROR)
    return {
      accessToken: signToken({ id: user._id.toString() }, 'access'),
      refreshToken: signToken({ id: user._id.toString() }, 'refresh'),
    }
  },
}
