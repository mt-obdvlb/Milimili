import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { searchGet } from '@/services/search'
import type { SearchGetRequest } from '@/types/search'

export const useSearch = (params: SearchGetRequest) => {
  const { data } = useQuery({
    queryKey: ['search', params],
    queryFn: () => searchGet(params),
    placeholderData: keepPreviousData,
    // 切换页码时保留旧数据
  })

  return {
    searchList: data?.data?.list.list || [],
    searchUser: data?.data?.user,
    total: data?.data?.list.total || 0,
  }
}
