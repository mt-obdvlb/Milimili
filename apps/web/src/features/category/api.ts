import { categoryGet, categoryGetById } from '@/services/category'

export const getCategoryList = async () => {
  const { data: categoryList } = await categoryGet()
  return {
    categoryList,
  }
}

export const getCategoryName = async (id: string) => {
  const { data } = await categoryGetById(id)
  return {
    categoryName: data?.name,
  }
}
