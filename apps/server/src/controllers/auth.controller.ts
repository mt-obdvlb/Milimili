import { MESSAGE } from '@/constants'
import { RequestHandler } from 'express'
import { AuthService } from '@/services/auth.service'

export const authRefresh: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) {
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  }

  try {
    const { accessToken, newRefreshToken } = await AuthService.refreshToken(refreshToken)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
    return res.status(200).json({
      code: 0,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : MESSAGE.INVALID_TOKEN
    return res.status(401).json({
      message: errorMessage,
      code: 1,
    })
  }
}

export const authSendCode: RequestHandler = async (req, res) => {
  const { email } = req.body
  try {
    await AuthService.sendCode(email)
    return res.status(200).json({
      code: 0,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : MESSAGE.UNKNOWN_ERROR
    return res.status(400).json({
      message: errorMessage,
      code: 1,
    })
  }
}
