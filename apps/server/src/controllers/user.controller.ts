import { UserLoginDTO } from '@/dtos/user/login.dto'
import { RequestHandler } from 'express'
import { UserService } from '@/services/user.service'
import { MESSAGE } from '@/constants'

export const userLogin: RequestHandler = async (req, res) => {
  const { email, password, code } = req.body as UserLoginDTO
  try {
    let accessToken, refreshToken
    if (password) {
      const result = await UserService.loginByPassword(email, password)
      accessToken = result.accessToken
      refreshToken = result.refreshToken
    } else if (code) {
      const result = await UserService.loginByCode(email, code)
      accessToken = result.accessToken
      refreshToken = result.refreshToken
    } else {
      return res.status(401).json({
        code: 1,
        message: MESSAGE.LOGIN_ERROR,
      })
    }
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: true,
    })
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: 'strict',
      secure: true,
    })
    return res.status(200).json({ code: 0 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : MESSAGE.LOGIN_ERROR
    return res.status(500).json({
      message: errorMessage,
      code: 1,
    })
  }
}

export const userLogout: RequestHandler = async (req, res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.status(200).json({ code: 0 })
}
