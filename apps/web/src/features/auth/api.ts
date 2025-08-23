import { authSendCode } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'

export const useAuthSendCode = () => {
  const { mutateAsync: sendCode } = useMutation({
    mutationFn: authSendCode,
  })
  return { sendCode }
}
