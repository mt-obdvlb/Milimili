import { UserLoginDTO } from '@/dtos/user/login.dto'
import { RequestHandler } from 'express'
import { UserService } from '@/services/user.service'
import { MESSAGE } from '@/constants'
import { Result } from '@mtobdvlb/shared-types'
import { UserGetInfoHomeVO } from '@/vos/user/get-info-home.vo'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserGetInfoVO } from '@/vos/user/get-info.vo'

export const userLogin: RequestHandler<ParamsDictionary, Result, UserLoginDTO> = async (
  req,
  res
) => {
  const { email, password, code } = req.body
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

export const userLogout: RequestHandler<ParamsDictionary, Result, void> = async (req, res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.status(200).json({ code: 0 })
}

export const userGetInfoHome: RequestHandler<
  ParamsDictionary,
  Result<UserGetInfoHomeVO>,
  void
> = async (req, res) => {
  if (!req.user)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  return res.status(200).json({
    data: await UserService.getInfoHome(req.user?.id),
    code: 0,
  })
}

export const userGetInfo: RequestHandler<ParamsDictionary, Result<UserGetInfoVO>> = async (
  req,
  res
) => {
  if (!req.user?.id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const data = await UserService.getInfo(req.user.id)
  return res.status(200).json({
    data,
    code: 0,
  })
}
