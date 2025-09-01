import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Result, SearchGetDTO, SearchGetList } from '@mtobdvlb/shared-types'
import { SearchLogService, SearchService } from '@/services'

export const searchGet: RequestHandler<
  ParamsDictionary,
  Result<SearchGetList>,
  SearchGetDTO
> = async (req, res) => {
  await SearchLogService.add({ keyword: req.body.kw })
  const data = await SearchService.get(req.body)
  return res.status(200).json({
    code: 0,
    data,
  })
}
