import {
  favoriteAddBatch,
  favoriteAddFolder,
  favoriteDeleteBatch,
  favoriteGetFolderList,
  favoriteGetRecent,
  favoriteMoveBatch,
} from '@/services/favorite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useFavoriteGetRecent = () => {
  const { data: favoriteRecentList } = useQuery({
    queryKey: ['favorite', 'recent'],
    queryFn: () => favoriteGetRecent(),
  })
  return {
    favoriteRecentList: favoriteRecentList?.data,
  }
}

export const useFavoriteGetFolderList = () => {
  const { data: favoriteFolderList } = useQuery({
    queryKey: ['favorite', 'list', 'folder'],
    queryFn: () => favoriteGetFolderList(),
  })
  return {
    favoriteFolderList: favoriteFolderList?.data,
  }
}

export const useFavoriteAddBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteAdd } = useMutation({
    mutationFn: favoriteAddBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorite', 'list'] })
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
      void queryClient.invalidateQueries({ queryKey: ['favorite', 'list'] })
    },
  })
  return { favoriteMove }
}

export const useFavoriteDeleteBatch = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: favoriteDelete } = useMutation({
    mutationFn: favoriteDeleteBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['video', 'watchLater'] })
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
