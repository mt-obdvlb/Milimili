import { searchLogGetTop10 } from '@/services/search-log'
import { useQuery } from '@tanstack/react-query'

export const useSearchLogGetTop10 = () => {
  const { data: searchLogTop10List } = useQuery({
    queryKey: ['search-log'],
    queryFn: () => searchLogGetTop10(),
  })
  return {
    searchLogTop10List: searchLogTop10List?.data,
  }
}
