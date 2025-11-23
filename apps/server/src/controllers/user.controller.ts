import { RequestHandler } from 'express'
import { UserService } from '@/services/user.service'
import { MESSAGE } from '@/constants'
import {
  PageResult,
  Result,
  UserAtDTO,
  UserAtItem,
  UserFindPasswordDTO,
  UserGetByEmailDTO,
  UserGetByName,
  UserGetByNameDTO,
  UserGetInfo,
  UserGetInfoHome,
  UserLoginDTO,
  UserUpdateDTO,
} from '@mtobdvlb/shared-types'
import { ParamsDictionary } from 'express-serve-static-core'

export const userLogin: RequestHandler<ParamsDictionary, Result, UserLoginDTO> = async (
  req,
  res
) => {
  const { email, password, code } = req.body
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
    sameSite: 'lax',
  })
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
    sameSite: 'lax',
  })
  return res.status(200).json({ code: 0 })
}

export const userLogout: RequestHandler<ParamsDictionary, Result, void> = async (_, res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.status(200).json({ code: 0 })
}

export const userGetInfoHome: RequestHandler<
  ParamsDictionary,
  Result<UserGetInfoHome>,
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

export const userGetInfo: RequestHandler<ParamsDictionary, Result<UserGetInfo>> = async (
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

export const userGetByEmail: RequestHandler<
  ParamsDictionary,
  Result<UserGetInfo>,
  UserGetByEmailDTO
> = async (req, res) => {
  const { email } = req.body

  const data = await UserService.getByEmail(email)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const userFindPassword: RequestHandler<
  ParamsDictionary,
  Result,
  UserFindPasswordDTO
> = async (req, res) => {
  await UserService.findPassword(req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const userGetByName: RequestHandler<
  ParamsDictionary,
  Result<UserGetByName>,
  UserGetByNameDTO
> = async (req, res) => {
  const { name } = req.query
  const data = await UserService.getByName(name as string)
  return res.status(200).json({
    data,
    code: 0,
  })
}

export const userAtList: RequestHandler<
  ParamsDictionary,
  Result<PageResult<UserAtItem>>,
  UserAtDTO
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const { list, total } = await UserService.getAtList(userId, req.body)
  return res.status(200).json({
    data: {
      list,
      total,
    },
    code: 0,
  })
}

export const userUpdateInfo: RequestHandler<ParamsDictionary, Result, UserUpdateDTO> = async (
  req,
  res
) => {
  if (!req.user?.id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  await UserService.update(req.user.id, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const userGetById: RequestHandler<ParamsDictionary, Result<UserGetInfo>> = async (
  req,
  res
) => {
  const { id } = req.params
  if (!id)
    return res.status(400).json({
      message: MESSAGE.INVALID_PARAMS,
      code: 1,
    })
  const data = await UserService.getById(id)
  return res.status(200).json({
    data,
    code: 0,
  })
}
