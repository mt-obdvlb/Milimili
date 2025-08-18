import { categoryGet } from '@/services/category'
import { isServer } from '@/utils'

export const getCategoryList = async () => {
  if (isServer()) await import('server-only')
  const { data: categoryList } = await categoryGet()
  return {
    categoryList,
  }
}
