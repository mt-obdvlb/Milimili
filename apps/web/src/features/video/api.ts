import { videoList } from '@/services/video'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export const getVideoList = async () => {
  const { data } = await videoList(1, 9)
  return {
    videoSwiperList: data?.list,
  }
}

export const useVideoList = () => {
  const { data: videoRecommendList } = useQuery({
    queryKey: ['videoRecommendList'],
    queryFn: () => videoList(1, 11),
  })

  const { data: videoRandomList, fetchNextPage } = useInfiniteQuery({
    queryKey: ['videoRandomList'],
    queryFn: ({ pageParam = 1 }) => videoList(pageParam as number, 10),
    getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
    initialPageParam: 1,
  })

  const allRandomVideos = videoRandomList?.pages.flatMap((page) => page.data?.list ?? []) ?? []

  return {
    videoRandomList: allRandomVideos,
    videoRecommendList: videoRecommendList?.data?.list,
    fetchNextPage,
  }
}
