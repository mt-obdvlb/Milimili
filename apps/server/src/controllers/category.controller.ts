import { RequestHandler } from 'express'
import { CategoryService } from '@/services/category.service'
import {
  CategoryCreateDTO,
  CategoryGetAllItem,
  CategoryGetAllList,
  CategoryGetByNameDTO,
  CategoryGetDTO,
  Result,
} from '@mtobdvlb/shared-types'
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

export const categoryGetById: RequestHandler<
  ParamsDictionary,
  Result<CategoryGetAllItem>,
  CategoryGetDTO
> = async (req, res) => {
  console.log(req.body, req.params)
  const { id } = req.body
  const data = await CategoryService.getById(id)
  return res.status(200).json({ data, code: 0 })
}

export const categoryGetByName: RequestHandler<
  ParamsDictionary,
  Result<CategoryGetAllItem>,
  CategoryGetByNameDTO
> = async (req, res) => {
  const { name } = req.body
  const data = await CategoryService.getByName(name)
  return res.status(200).json({ data, code: 0 })
}
