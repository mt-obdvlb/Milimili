import { CategoryModel } from '@/models'

export const CategoryService = {
  create: async (name: string) => {
    await CategoryModel.create({ name })
  },
  getAll: async () => {
    const res = await CategoryModel.find()
    return res.map((item) => ({
      id: item._id.toString(),
      name: item.name,
    }))
  },
}
