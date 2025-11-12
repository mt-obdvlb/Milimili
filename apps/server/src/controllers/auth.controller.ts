import { MESSAGE } from '@/constants'
import { RequestHandler } from 'express'
import { AuthService } from '@/services/auth.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { AuthRefresh, AuthSendCodeDTO, Result } from '@mtobdvlb/shared-types'

export const authRefresh: RequestHandler<ParamsDictionary, Result<AuthRefresh>> = async (
  req,
  res
) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) {
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  }

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
    data: {
      accessToken,
      refreshToken,
    },
  })
}

export const authSendCode: RequestHandler<ParamsDictionary, Result, AuthSendCodeDTO> = async (
  req,
  res
) => {
  const { email } = req.body
  await AuthService.sendCode(email)
  return res.status(200).json({
    code: 0,
  })
}
