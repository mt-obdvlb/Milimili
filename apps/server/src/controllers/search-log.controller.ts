import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Result } from '@mtobdvlb/shared-types'
import { SearchLogAddDTO } from '@/dtos/search-log/add.dto'
import { SearchLogService } from '@/services/search-log.service'
import { SearchLogTop10VO } from '@/vos/search-log/top10.vo'

export const searchLogAdd: RequestHandler<ParamsDictionary, Result, SearchLogAddDTO> = async (
  req,
  res
) => {
  const { keyword } = req.body
  if (!keyword) {
    return res.status(400).json({
      code: 400,
      message: '参数错误',
    })
  }
  await SearchLogService.add({ keyword })
  return res.status(200).json({
    code: 0,
  })
}

export const searchLogTop10: RequestHandler<ParamsDictionary, Result<SearchLogTop10VO>> = async (
  req,
  res
) => {
  const data = await SearchLogService.getTop10()
  return res.status(200).json({
    code: 0,
    data,
  })
}
