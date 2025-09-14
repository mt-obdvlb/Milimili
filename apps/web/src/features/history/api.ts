import {
  historyClearUp,
  historyDeleteBatch,
  historyGetList,
  historyGetRecent,
} from '@/services/history'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HistoryGetDTO } from '@mtobdvlb/shared-types'
import { HistoryGetRequest } from '@/types'

export const useHistoryGetRecent = () => {
  const { data: historyRecentList } = useQuery({
    queryKey: ['history', 'recent'],
    queryFn: () => historyGetRecent(),
  })
  return { historyRecentList: historyRecentList?.data }
}

export const useHistoryList = (
  params: Omit<HistoryGetRequest, 'page' | 'pageSize'>,
  pageSize = 20
) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['history', 'list', params, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      // 调用接口
      const { data } = await historyGetList({
        ...params,
        page: pageParam as number,
        pageSize,
      } as HistoryGetDTO)

      // 这里做结构映射
      return {
        list: data?.list ?? [],
        total: data?.total ?? 0,
        page: pageParam as number,
        pageSize,
      }
    },

    getNextPageParam: (lastPage) => {
      const maxPage = Math.ceil(lastPage.total / lastPage.pageSize)
      return lastPage.page < maxPage ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
  })

  const historyList = data?.pages.flatMap((p) => p.list) ?? []

  return {
    historyList,
    fetchNextPage,
    hasNextPage,
  }
}

export const useHistoryCleanUp = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: cleanUp } = useMutation({
    mutationFn: historyClearUp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['history', 'list'],
        exact: false,
      })
    },
  })
  return { cleanUp }
}

export const useHistoryDeleteBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: historyDelete } = useMutation({
    mutationFn: historyDeleteBatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['history', 'list'] })
    },
  })
  return { historyDelete }
}
