'use client'

import { Separator } from '@/components/ui/separator'
import { cn, toast } from '@/lib'
import { Button } from '@/components/ui/button'
import { LoginModelFormStyles } from '@/components/layout/models/login-model/LoginModel'
import { Dispatch, SetStateAction } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Image from 'next/image'
import { openNewTab } from '@/utils/openNewTab'
import { useUserLogin } from '@/features/user/api'

const schema = z.object({
  email: z.string().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码'),
})

type FormData = z.infer<typeof schema>

const LoginModelPassword = ({
  formStyles,
  setTabsValue,
  isPasswordOpen,
  setIsPasswordOpen,
  setPasswordFocus,
}: {
  formStyles: LoginModelFormStyles
  setTabsValue: Dispatch<SetStateAction<'password' | 'code'>>
  isPasswordOpen: boolean
  setIsPasswordOpen: Dispatch<SetStateAction<boolean>>
  setPasswordFocus?: Dispatch<SetStateAction<boolean>>
}) => {
  const { input, btnOther, btnPrimary, btnWrap, label, item } = formStyles

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { login } = useUserLogin()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { error, success } = await schema.safeParseAsync(data)
    if (!success) {
      toast(error.message)
      return
    }
    const res = await login(data)
    if (res.code) return
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div
          className={
            'h-[90px] w-full rounded-[8px] border border-[#e3e5e7] leading-5 text-[#212121]'
          }
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className={item()}>
                <FormLabel className={label()}>账号</FormLabel>
                <FormControl>
                  <Input {...field} className={input()} type='text' placeholder='请输入账号' />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator className={'my-0'} />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className={item()}>
                <FormLabel className={label()}>密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={input()}
                    type={isPasswordOpen ? 'text' : 'password'}
                    placeholder='请输入密码'
                    onFocus={() => setPasswordFocus?.(true)}
                    onBlur={() => setPasswordFocus?.(false)}
                  />
                </FormControl>

                {/* 密码显隐切换 */}
                <div
                  onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                  className={'relative mr-[10px] inline-block size-5 cursor-pointer'}
                >
                  {/* 省略svg不变 */}
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className={'size-5 text-[#9499A0] hover:text-[#00a1d6]'}
                  >
                    {isPasswordOpen ? (
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M2.11069 9.43732C3.21647 7.77542 5.87904 4.58331 9.89458 4.58331...'
                        fill='currentColor'
                      />
                    ) : (
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M17.5753 6.85456C17.7122 6.71896...'
                        fill='currentColor'
                      />
                    )}
                  </svg>
                </div>

                {/* 忘记密码 */}
                <Popover>
                  <PopoverTrigger
                    className={
                      'm-0 cursor-pointer border-none bg-transparent p-0 text-[#00a1d6] hover:bg-transparent'
                    }
                  >
                    忘记密码?
                  </PopoverTrigger>
                  <PopoverContent
                    sideOffset={20}
                    className={
                      'relative z-10010 h-30 w-[332px] rounded-[5px] bg-white p-0 shadow-[0_1px_5px_rgba(0,0,0,0.21)]'
                    }
                  >
                    <Image
                      width={34}
                      height={15}
                      src={'/images/arrow.png'}
                      alt={'arrow'}
                      className='absolute -top-[15px] left-1/2 -translate-x-1/2'
                    />
                    {[
                      {
                        title: '发送邮箱短信快速登录',
                        desc: '未注册或绑定哔哩哔哩的邮箱号，将帮你注册新账号',
                        onClick: () => setTabsValue('code'),
                      },
                      {
                        title: '去找回密码',
                        desc: '通过绑定的邮箱重置密码',
                        onClick: () => openNewTab('/find-password'),
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        onClick={item.onClick}
                        className={'m-0 cursor-pointer py-[11px] pr-0 pl-[18px]'}
                      >
                        <p
                          className={
                            'align-baseline text-sm leading-4.5 font-normal text-[#212121]'
                          }
                        >
                          {item.title}
                        </p>
                        <p className={'align-baseline text-xs leading-4.5 font-normal text-[#999]'}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <div className={btnWrap()}>
          <Button
            type={'button'}
            onClick={() => setTabsValue('code')}
            variant={'outline'}
            className={btnOther()}
          >
            注册
          </Button>
          <Button
            type='submit'
            className={cn(
              btnPrimary(),
              !(form.getValues('password') || form.getValues('email')) &&
                'cursor-not-allowed opacity-50 hover:opacity-50'
            )}
          >
            登录
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginModelPassword
