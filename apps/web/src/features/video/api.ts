import {
  videoGetDetail,
  videoList,
  videoListLike,
  videoListSpace,
  videoShare,
} from '@/services/video'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { VideoListSpaceDTO } from '@mtobdvlb/shared-types'

export const getVideoList = async () => {
  const { data } = await videoList(1, 9)
  return {
    videoSwiperList: data?.list,
  }
}

export const useVideoList = (pageSize: number = 11) => {
  const { data: videoRecommendList } = useQuery({
    queryKey: ['video', 'recommend', pageSize],
    queryFn: () => videoList(1, pageSize),
  })

  const { data: videoRandomList, fetchNextPage } = useInfiniteQuery({
    queryKey: ['video'],
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

export const getVideoDetail = async (id: string) => {
  const { data } = await videoGetDetail(id)
  return {
    videoDetail: data,
  }
}

export const useVideoShare = () => {
  const { mutateAsync } = useMutation({
    mutationFn: videoShare,
  })
  return {
    shareVideo: mutateAsync,
  }
}

export const useVideoLikeList = (userId: string) => {
  const { data: videoLikeList } = useQuery({
    queryKey: ['video', 'like', 'list', userId],
    queryFn: () => videoListLike(userId),
  })
  return {
    videoLikeList: videoLikeList?.data ?? [],
  }
}

export const useVideoListSpace = (body: VideoListSpaceDTO) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['video', 'space', body],
    queryFn: () => videoListSpace(body),
  })

  return {
    videoSpaceList: data?.data?.list ?? [],
    total: data?.data?.total ?? 0,
    isLoading,
    refetch,
  }
}
