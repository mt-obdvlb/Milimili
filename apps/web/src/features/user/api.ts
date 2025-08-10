import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUser, loginUser, logoutUser } from '@/services/user'
import { UserLoginRequest } from '@/types/user'

export const useUserGet = () => {
  const { data: user, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
  })
  return { user, error }
}

export const useUserLogin = (data: UserLoginRequest) => {
  const { mutate: login, error } = useMutation({
    mutationFn: () => loginUser(data),
  })
  return { login, error }
}

export const useUserLogout = () => {
  const queryClient = useQueryClient()
  const { mutate: logout, error } = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
  return { logout, error }
}
