import { useInfiniteQuery } from '@tanstack/react-query'
import { searchGet } from '@/services/search'
import type { SearchGetRequest } from '@/types/search'
import { Result, SearchGetList } from '@mtobdvlb/shared-types'

export const useSearch = (params: SearchGetRequest) => {
  return useInfiniteQuery<Result<SearchGetList>, unknown>({
    queryKey: ['search', params],
    queryFn: async ({ pageParam = 1 }) => {
      // pageParam 是前端累加页码
      return await searchGet({
        ...params,
        page: pageParam as number,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce((sum, page) => sum + page.data!.list.list.length, 0)
      const totalItems = lastPage.data!.list.total

      // 已加载数量 >= 总数，就没有下一页
      if (loadedItems >= totalItems) return undefined

      // 下一页就是当前已加载页数 + 1
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}
