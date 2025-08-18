import { categoryGet } from '@/services/category'

export const getCategoryList = async () => {
  await import('server-only')
  const { data: categoryList } = await categoryGet()
  return {
    categoryList,
  }
}
