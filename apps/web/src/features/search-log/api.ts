import { searchLogGet, searchLogGetTop10 } from '@/services/search-log'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const getSearchLogTop10 = async () => {
  const { data: searchLogTop10List } = await searchLogGetTop10()
  return {
    searchLogTop10List: searchLogTop10List,
  }
}

export const useSearchLogGet = (keyword: string) => {
  const { data: searchLogList, isLoading } = useQuery({
    queryFn: () => searchLogGet(keyword),
    queryKey: ['searchLog', keyword],
    placeholderData: keepPreviousData,
  })
  return {
    searchLogList: searchLogList?.data,
    isLoading,
  }
}
