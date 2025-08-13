import { RequestHandler } from 'express'
import { CategoryCreateDTO } from '@/dtos/category/create.dto'
import { CategoryService } from '@/services/category.service'

export const categoryGetAll: RequestHandler = async (req, res) => {
  const data = await CategoryService.getAll()
  return res.status(200).json({ data, code: 0 })
}

export const categoryCreate: RequestHandler = async (req, res) => {
  const { name } = req.body as CategoryCreateDTO
  await CategoryService.create(name)
  return res.status(200).json({ code: 0 })
}
