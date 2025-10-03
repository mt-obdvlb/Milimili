import {
  feedDelete,
  feedGetById,
  feedGetFollowing,
  feedGetRecent,
  feedList,
  feedPublish,
  feedTranspont,
} from '@/services/feed'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FeedPropsType } from '@/features'

export const useFeedGetRecent = () => {
  const { data: feedRecentList } = useQuery({
    queryKey: ['feed', 'recent'],
    queryFn: () => feedGetRecent(),
  })
  return { feedRecentList: feedRecentList?.data }
}

export const useFeedGetFollowingList = () => {
  const { data: followingList } = useQuery({
    queryKey: ['feed', 'following'],
    queryFn: () => feedGetFollowing(),
  })
  return {
    followingList: followingList?.data,
  }
}

export const useFeedPublish = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: publishFeed } = useMutation({
    mutationFn: feedPublish,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed', 'list'] })
    },
  })
  return { publishFeed }
}

export const useFeedGetList = ({ userId, type }: { type: FeedPropsType; userId: string }) => {
  const { data, fetchNextPage, refetch, hasNextPage } = useInfiniteQuery({
    queryKey: ['feed', 'list', userId, type],
    queryFn: ({ pageParam = 1 }) => feedList({ page: pageParam, pageSize: 10, type, userId }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + (page.data?.list.length ?? 0), 0)
      if (loaded < (lastPage.data?.total ?? 0)) {
        return allPages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
  return {
    feedList: data?.pages.flatMap((page) => page.data?.list ?? []) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage,
  }
}

export const useFeedGetById = (id: string) => {
  const { data } = useQuery({
    queryKey: ['feed', 'get', id],
    queryFn: () => feedGetById(id),
  })
  return {
    feed: data?.data,
  }
}

export const useFeedTranspont = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: transpont } = useMutation({
    mutationFn: feedTranspont,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feed', 'list'] })
    },
  })
  return { transpont }
}

export const useFeedDelete = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: deleteFeed } = useMutation({
    mutationFn: feedDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feed', 'list'] })
    },
  })
  return { deleteFeed }
}
