import {
  videoCreate,
  videoDelete,
  videoGetDetail,
  videoList,
  videoListLike,
  videoListSpace,
  videoShare,
  videoUpdate,
} from '@/services/video'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { VideoCreateDTO, VideoListSpaceDTO } from '@mtobdvlb/shared-types'

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
    queryKey: ['video', 'list'],
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

export const useVideoPageList = (
  params: Omit<VideoListSpaceDTO, 'userId'> & { userId?: string }
) => {
  const { data } = useQuery({
    queryKey: ['video', 'list', params],
    queryFn: () => videoListSpace(params as VideoListSpaceDTO),
    enabled: !!params.userId,
  })
  return {
    videoPageList: data?.data?.list ?? [],
    total: data?.data?.total ?? 0,
  }
}

export const useVideoDetail = (id: string) => {
  const { data: videoDetail } = useQuery({
    queryKey: ['video', 'detail', id],
    queryFn: () => getVideoDetail(id),
    enabled: !!id,
  })
  return {
    videoDetail: videoDetail?.videoDetail,
  }
}

export const useVideoCreateUpdate = (body: Partial<VideoCreateDTO>, userId?: string) => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: () => (userId ? videoUpdate(userId, body) : videoCreate(body)),
    mutationKey: ['video', userId ? 'update' : 'create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['video', 'list'] })
      await queryClient.invalidateQueries({ queryKey: ['video', 'space'] })
      await queryClient.invalidateQueries({ queryKey: ['video', 'detail'] })
    },
  })
  return {
    createUpdateVideo: mutateAsync,
  }
}

export const useVideoDelete = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: videoDelete,
    mutationKey: ['video', 'delete'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['video', 'list'] })
      await queryClient.invalidateQueries({ queryKey: ['video', 'space'] })
      await queryClient.invalidateQueries({ queryKey: ['video', 'detail'] })
    },
  })
  return {
    deleteVideo: mutateAsync,
  }
}
