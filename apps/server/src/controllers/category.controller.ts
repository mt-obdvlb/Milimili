import { RequestHandler } from 'express'
import { CategoryCreateDTO } from '@/dtos/category/create.dto'
import { CategoryService } from '@/services/category.service'
import { CategoryGetAllList, Result } from '@mtobdvlb/shared-types'
import { ParamsDictionary } from 'express-serve-static-core'

export const categoryGetAll: RequestHandler<ParamsDictionary, Result<CategoryGetAllList>> = async (
  req,
  res
) => {
  const data = await CategoryService.getAll()
  return res.status(200).json({ data, code: 0 })
}

export const categoryCreate: RequestHandler<ParamsDictionary, Result, CategoryCreateDTO> = async (
  req,
  res
) => {
  const { name } = req.body as CategoryCreateDTO
  await CategoryService.create(name)
  return res.status(200).json({ code: 0 })
}
