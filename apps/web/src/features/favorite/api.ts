import {
  favoriteAddBatch,
  favoriteAddFolder,
  favoriteDeleteBatch,
  favoriteDeleteFolder,
  favoriteGetByVideoId,
  favoriteGetDetail,
  favoriteGetFolderList,
  favoriteGetRecent,
  favoriteList,
  favoriteMoveBatch,
  favoriteToggleWatchLater,
  favoriteUpdateFolder,
} from '@/services/favorite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FavoriteListDTO } from '@mtobdvlb/shared-types'

export const useFavoriteGetRecent = () => {
  const { data: favoriteRecentList } = useQuery({
    queryKey: ['favorite', 'recent'],
    queryFn: () => favoriteGetRecent(),
  })
  return {
    favoriteRecentList: favoriteRecentList?.data,
  }
}

export const useFavoriteGetFolderList = (userId?: string) => {
  const { data: favoriteFolderList } = useQuery({
    queryKey: ['favorite', 'list', 'folder', userId],
    queryFn: () => favoriteGetFolderList(userId),
  })
  return {
    favoriteFolderList: favoriteFolderList?.data,
  }
}

export const useFavoriteAddBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteAdd } = useMutation({
    mutationFn: favoriteAddBatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['favorite'] })
    },
  })
  return {
    favoriteAdd,
  }
}

export const useFavoriteMoveBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteMove } = useMutation({
    mutationFn: favoriteMoveBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorite'] })
      void queryClient.invalidateQueries({ queryKey: ['video', 'list'] })
    },
  })
  return { favoriteMove }
}

export const useFavoriteDeleteBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteDelete } = useMutation({
    mutationFn: favoriteDeleteBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['video', 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['favorite'] })
    },
  })
  return { favoriteDelete }
}

export const useFavoriteFolderAdd = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteFolderAdd } = useMutation({
    mutationFn: favoriteAddFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['favorite', 'list', 'folder'],
        exact: false,
      })
    },
  })
  return { favoriteFolderAdd }
}

export const useFavoriteGetByVideoId = (videoId: string) => {
  const { data } = useQuery({
    queryKey: ['favorite', videoId],
    queryFn: () => favoriteGetByVideoId(videoId),
    enabled: !!videoId,
  })
  return {
    isFavorite: !data?.code,
  }
}

export const useFavoriteList = (params: FavoriteListDTO) => {
  const { data } = useQuery({
    queryKey: ['favorite', 'list', params],
    queryFn: () => favoriteList(params),
    enabled: !!params.favoriteFolderId,
  })

  return {
    favoriteList: data?.data?.list ?? [],
    total: data?.data?.total ?? 0,
  }
}

export const useFavoriteDetail = (folderId: string) => {
  const { data } = useQuery({
    queryKey: ['favorite', 'detail', folderId],
    queryFn: () => favoriteGetDetail(folderId),
    enabled: !!folderId,
  })
  return {
    favoriteDetail: data?.data,
  }
}

export const useFavoriteFolderUpdate = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: favoriteUpdateFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['favorite', 'list', 'folder'],
        exact: false,
      })
    },
  })
  return { favoriteFolderUpdate: mutateAsync }
}

export const useFavoriteFolderDelete = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: favoriteDeleteFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['favorite', 'list', 'folder'],
        exact: false,
      })
    },
  })
  return { favoriteFolderDelete: mutateAsync }
}

export const useFavoriteWatchLaterToggle = (videoId: string) => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteWatchLaterToggle } = useMutation({
    mutationFn: () => favoriteToggleWatchLater(videoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['favorite', videoId],
      })
    },
  })
  return { favoriteWatchLaterToggle }
}
