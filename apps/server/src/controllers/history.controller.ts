import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HistoryListDTO } from '@/dtos/history/list.dto'
import { Result } from '@mtobdvlb/shared-types'
import { HistoryListVO } from '@/vos/history/list.vo'
import { MESSAGE } from '@/constants'
import { HistoryService } from '@/services/history.service'
import { HistoryAddDTO } from '@/dtos/history/add.dto'

export const historyList: RequestHandler<
  ParamsDictionary,
  Result<HistoryListVO>,
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

export const historyRecent: RequestHandler<ParamsDictionary, Result<HistoryListVO>> = async (
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
