import { categoryGet, categoryGetById } from '@/services/category'
import { useQuery } from '@tanstack/react-query'

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

export const useCategoryList = () => {
  const { data } = useQuery({
    queryKey: ['category', 'list'],
    queryFn: getCategoryList,
  })
  return {
    categoryList: data?.categoryList,
  }
}

export const useCategoryName = (id: string) => {
  const { data } = useQuery({
    queryKey: ['category', 'name', id],
    queryFn: () => getCategoryName(id),
  })
  return {
    categoryName: data?.categoryName,
  }
}
