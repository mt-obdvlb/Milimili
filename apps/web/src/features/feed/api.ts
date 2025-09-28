import { feedGetFollowing, feedGetRecent, feedList, feedPublish } from '@/services/feed'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useFeedGetList = () => {
  const { data, fetchNextPage, refetch, hasNextPage } = useInfiniteQuery({
    queryKey: ['feed', 'list'],
    queryFn: ({ pageParam = 1 }) => feedList({ page: pageParam }),
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
