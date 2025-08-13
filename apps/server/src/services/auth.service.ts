import { signToken, verifyToken } from '@/utils'
import { UserModel } from '@/models'
import { MESSAGE } from '@/constants'
import { generateCode } from '@/utils/generate-code.util'
import redis from '@/utils/redis.util'
import { EmailService } from '@/services/email.service'

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
  sendCode: async (email: string) => {
    const timerKey = `email_code_timer:${email}`
    const codeKey = `email_code:${email}`
    if (await redis.exists(timerKey)) throw new Error(MESSAGE.RATE_LIMIT_EXCEEDED)

    const code = generateCode(6)

    await redis.set(codeKey, code, 'EX', 300)
    await redis.set(timerKey, '1', 'EX', 60)

    await EmailService.sendVerifyCode(email, code)
  },
}
