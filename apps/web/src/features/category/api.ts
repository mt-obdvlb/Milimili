import { categoryGet, categoryGetById, categoryGetByName } from '@/services/category'
import { useQuery } from '@tanstack/react-query'

export const getCategoryList = async () => {
  const { data: categoryList } = await categoryGet()
  return {
    categoryList: categoryList,
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

export const useCategoryGetBy = (id?: string, name?: string) => {
  const { data: byId } = useQuery({
    queryKey: ['category', 'name', id],
    queryFn: () => categoryGetById(id!),
    enabled: !!id,
  })
  const { data: byName } = useQuery({
    queryKey: ['category', 'name', name],
    queryFn: () => categoryGetByName({ name: name! }),
    enabled: !!name,
  })

  return {
    category: byId?.data ?? byName?.data,
  }
}
