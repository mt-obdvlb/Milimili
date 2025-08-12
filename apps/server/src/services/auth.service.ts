import { signToken, verifyToken } from '@/utils'
import { UserModel } from '@/models'
import { MESSAGE } from '@/constants'

export const AuthService = {
  refreshToken: async (refreshToken: string) => {
    const decoded = verifyToken(refreshToken)
    if (!decoded?.id) {
      throw new Error(MESSAGE.INVALID_TOKEN)
    }

    const user = await UserModel.findById(decoded.id)
    if (!user) {
      throw new Error(MESSAGE.USER_NOT_FOUND)
    }

    const accessToken = signToken({ id: user.id }, 'access')
    const newRefreshToken = signToken({ id: user.id }, 'refresh')
    return {
      accessToken,
      newRefreshToken,
    }
  },
}
