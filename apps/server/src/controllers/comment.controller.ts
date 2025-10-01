import {
  CommentDeleteDTO,
  CommentDTO,
  CommentGetDTO,
  CommentGetItem,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CommentService } from '@/services'

export const comment: RequestHandler<ParamsDictionary, Result, CommentDTO> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
    })
  await CommentService.comment(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const commentGet: RequestHandler<
  ParamsDictionary,
  Result<PageResult<CommentGetItem>>,
  CommentGetDTO
> = async (req, res) => {
  const { list, total } = await CommentService.get(req.body)
  return res.status(200).json({
    code: 0,
    data: {
      list,
      total,
    },
  })
}

export const commentDelete: RequestHandler<ParamsDictionary, Result, CommentDeleteDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
    })
  await CommentService.delete(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}
