'use client'

import { Separator } from '@/components/ui/separator'
import { cn, toast } from '@/lib'
import { Button } from '@/components/ui/button'
import { LoginModelFormStyles } from '@/components/layout/login-model/LoginModel'
import { z } from 'zod'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useAuthSendCode } from '@/features/auth/api'
import { useUserLogin } from '@/features/user/api'

const schema = z.object({
  code: z.string().min(1, '请输入验证码'),
  email: z.email('请输入邮箱'),
})

type FormData = z.infer<typeof schema>

const LoginModelCode = ({ formStyles }: { formStyles: LoginModelFormStyles }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      code: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const [countdown, setCountdown] = useState(0)

  const { sendCode } = useAuthSendCode()
  const { login } = useUserLogin()

  const { label, btnWrap, btnPrimary, input, item } = formStyles

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { error, success } = await schema.safeParseAsync(data)
    if (!success) {
      toast(error.message)
      return
    }
    const res = await login(data)
    toast(res.message ?? '')
    window.location.reload()
  }

  const onError: SubmitErrorHandler<FormData> = (errors) => {
    toast(
      Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean)
        .join(',')
    )
  }

  // 发送验证码
  const handleSendCode = async () => {
    const email = form.getValues('email')
    const { error, success } = await schema.pick({ email: true }).safeParseAsync({ email })
    if (!success) {
      toast(error.message)
      return
    }
    const res = await sendCode({ email })
    toast(res.code ? (res.message ?? '') : '验证码已发送')
    setCountdown(60)
  }

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const emailValue = form.watch('email')
  const emailValid = z.email().safeParse(emailValue).success

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className='h-[90px] w-full rounded-[8px] border border-[#e3e5e7] leading-5 text-[#212121]'>
          {/* 邮箱 */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className={item()}>
                <FormLabel className={label()}>邮箱号</FormLabel>
                <FormControl>
                  <Input {...field} className={input()} type='text' placeholder='请输入邮箱' />
                </FormControl>
                <Separator className='mx-0 my-0 mr-5 h-[26px]' orientation='vertical' />
                <div
                  onClick={countdown ? () => {} : handleSendCode}
                  className={cn(
                    'm-0 w-[90px] p-0 text-center text-sm leading-5 font-normal',
                    emailValid && !countdown
                      ? 'cursor-pointer text-[#00a1d6]'
                      : 'cursor-not-allowed text-[#c9ccd0]'
                  )}
                >
                  {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                </div>
              </FormItem>
            )}
          />

          <Separator className='my-0' />

          {/* 验证码 */}
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem className={item()}>
                <FormLabel className={label()}>验证码</FormLabel>
                <FormControl>
                  <Input {...field} className={input()} placeholder='请输入验证码' />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className={cn(btnWrap(), 'justify-center')}>
          <Button type='submit' className={btnPrimary()}>
            登录/注册
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginModelCode
