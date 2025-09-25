import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUser,
  getUserByEmail,
  getUserByName,
  loginUser,
  logoutUser,
  userFindPassword,
  userGetHomeInfo,
} from '@/services/user'

export const useUserGet = () => {
  const { data: user, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
  })
  return { user, error }
}

export const useUserLogin = () => {
  const { mutateAsync: login, error } = useMutation({
    mutationFn: loginUser,
  })
  return { login, error }
}

export const useUserLogout = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: logout, error } = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
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
