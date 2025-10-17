import { messageGetList, messageGetStatistics } from '@/services'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { MessageType } from '@mtobdvlb/shared-types'

export const useMessageStatistics = () => {
  const { data: messageStatistics } = useQuery({
    queryKey: ['message', 'statistics'],
    queryFn: () => messageGetStatistics(),
  })
  return {
    messageStatistics: messageStatistics?.data,
  }
}

export const useMessageList = (type: MessageType) => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', 'list', type], // 不同 type 会从头开始
    queryFn: ({ pageParam = 1 }) =>
      messageGetList({ type, page: pageParam as number, pageSize: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + (page.data?.list.length ?? 0), 0)
      if (loaded < (lastPage.data?.total ?? 0)) {
        return allPages.length + 1 // 下一页页码
      }
      return undefined // 没有下一页
    },
    initialPageParam: 1,
  })
  return {
    messageList: data?.pages.flatMap((page) => page.data?.list ?? []) ?? [],
    fetchNextPage,
  }
}
