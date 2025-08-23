import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUser, loginUser, logoutUser, userGetHomeInfo } from '@/services/user'

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
  console.log('userHomeInfo', userHomeInfo)
  return { userHomeInfo }
}
