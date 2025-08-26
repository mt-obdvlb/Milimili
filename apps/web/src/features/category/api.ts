import { categoryGet } from '@/services/category'

export const getCategoryList = async () => {
  const { data: categoryList } = await categoryGet()
  return {
    categoryList,
  }
}
