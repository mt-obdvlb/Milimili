import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUser,
  getUserAtList,
  getUserByEmail,
  getUserById,
  getUserByName,
  loginUser,
  logoutUser,
  userFindPassword,
  userGetHomeInfo,
} from '@/services/user'
import { updateUser } from '@/services'
import { useUserStore } from '@/stores'

export const useUserGet = () => {
  const { data: user, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
  })
  return { user: user?.data, error }
}

export const useUserLogin = () => {
  const { mutateAsync: login, error } = useMutation({
    mutationFn: loginUser,
  })
  return { login, error }
}

export const useUserLogout = () => {
  const logoutUserStore = useUserStore((state) => state.logoutUser)
  const { mutateAsync: logout, error } = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: async () => {
      logoutUserStore()
      window.location.reload()
    },
  })
  return { logout, error }
}

export const getUserHomeInfo = async () => {
  const { data: userHomeInfo } = await userGetHomeInfo()
  return { userHomeInfo }
}

export const useUserGetByEmail = (email: string) => {
  const { refetch } = useQuery({
    queryKey: ['user', email],
    queryFn: () => getUserByEmail(email),
    enabled: false,
  })
  return { getByEmail: refetch }
}

export const useUserFindPassword = () => {
  const { mutateAsync: findPassword } = useMutation({
    mutationFn: userFindPassword,
  })
  return { findPassword }
}

export const useUserGetByName = (name: string) => {
  const { data } = useQuery({
    queryKey: ['user', name],
    queryFn: () => getUserByName(name),
    enabled: !!name,
  })
  return { data: data?.data }
}

export const useUserGetAtList = (keyword: string) => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['user', 'at', keyword],
    queryFn: ({ pageParam = 1 }) =>
      getUserAtList({ keyword, page: pageParam as number, pageSize: 10 }),
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
    fetchNextPage,
    atList: data?.pages.flatMap((page) => page.data?.list ?? []) ?? [],
  }
}

export const useUserUpdateInfo = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserInfo } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
  return { updateUserInfo }
}

export const useUserGetById = (id: string) => {
  const { data } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
  return { user: data?.data }
}
