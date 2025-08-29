import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { toast } from '@/lib'
import { useAuthSendCode } from '@/features/auth/api'

const emailSchema = z.email('请输入有效邮箱')

export const useSendCode = () => {
  const { sendCode } = useAuthSendCode()
  const [countdown, setCountdown] = useState(0)

  // 发送验证码并启动倒计时
  const handleSendCode = useCallback(
    async (email: string) => {
      const result = emailSchema.safeParse(email)
      if (!result.success) {
        toast(result.error.issues[0]?.message ?? '请输入正确邮箱')
        return
      }

      await sendCode({ email })
      toast('验证码已发送')
      setCountdown(60)
    },
    [sendCode]
  )

  // 倒计时逻辑
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  return { countdown, handleSendCode }
}
