import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HistoryAddDTO, HistoryList, HistoryListDTO, Result } from '@mtobdvlb/shared-types'
import { MESSAGE } from '@/constants'
import { HistoryService } from '@/services/history.service'

export const historyList: RequestHandler<
  ParamsDictionary,
  Result<HistoryList>,
  HistoryListDTO
> = async (req, res) => {
  const userId = req.user?.id
  const { page, pageSize } = req.body
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })

  const data = await HistoryService.list({
    userId,
    page,
    pageSize,
  })
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const historyRecent: RequestHandler<ParamsDictionary, Result<HistoryList>> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await HistoryService.list({
    userId,
    page: 1,
    pageSize: 20,
  })
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const historyAdd: RequestHandler<ParamsDictionary, Result, HistoryAddDTO> = async (
  req,
  res
) => {
  if (!req.user?.id) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  req.body.userId = req.user.id
  await HistoryService.add(req.body)
  return res.status(200).json({
    code: 0,
  })
}
