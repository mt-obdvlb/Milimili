import {
  messageCreateConversation,
  messageDelete,
  messageDeleteConversation,
  messageGetConversation,
  messageGetList,
  messageGetStatistics,
  messageRead,
  messageSendWhisper,
} from '@/services'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageType } from '@mtobdvlb/shared-types'

export const useMessageStatistics = () => {
  const { data: messageStatistics } = useQuery({
    queryKey: ['messages', 'statistics'],
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
    refetchOnMount: true, // 组件挂载时重新请求
    refetchOnWindowFocus: false, // 避免切换窗口时重复请求
    refetchOnReconnect: false,
    staleTime: 0, // 每次都认为是旧数据,
  })
  return {
    messageList: data?.pages.flatMap((page) => page.data?.list ?? []) ?? [],
    fetchNextPage,
  }
}

export const useMessageDelete = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => messageDelete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
  return {
    deleteMessage: mutateAsync,
  }
}

export const useMessageRead = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: messageRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] })
    },
  })
  return {
    readMessage: mutateAsync,
  }
}

export const useMessageConversation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteConversation } = useMutation({
    mutationFn: messageDeleteConversation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const { mutateAsync: createConversation } = useMutation({
    mutationFn: messageCreateConversation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  return {
    deleteConversation,
    createConversation,
  }
}

export const useMessageConversationDetail = (userId: string) => {
  const { data: conversation } = useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => messageGetConversation(userId),
    enabled: !!userId,
  })
  return {
    conversation: conversation?.data,
  }
}

export const useMessageSend = (userId: string) => {
  const queryClient = useQueryClient()
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: messageSendWhisper,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversation', userId] })
    },
  })
  return {
    sendMessage,
  }
}
