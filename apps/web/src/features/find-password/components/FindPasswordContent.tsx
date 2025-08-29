'use client'

import { tv } from 'tailwind-variants'
import { cn, toast } from '@/lib'
import { Button, Input, Separator } from '@/components'
import { useEffect, useState } from 'react'
import { SubmitErrorHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useUserFindPassword, useUserGetByEmail } from '@/features'
import { userFindPasswordDTO, userGetByEmailDTO } from '@mtobdvlb/shared-types'
import { useSendCode } from '@/hooks/useSendCode'

// step1: 邮箱
const emailSchema = userGetByEmailDTO

// step2: 新密码
const passwordSchema = userFindPasswordDTO

type EmailValues = z.infer<typeof emailSchema>
type PasswordValues = z.infer<typeof passwordSchema>

const FindPasswordContent = () => {
  const fpStyles = tv({
    slots: {
      content: cn('mx-auto mt-10 w-[520px]'),
      stepWp: cn('flex items-center justify-between mb-10'),
      itemWp: cn('w-100 mx-auto'),
      inputWp: cn(
        'mt-[30px] w-100 h-[45px] border border-[#e3e5e7] rounded-[8px] flex items-center py-2 px-5'
      ),
      btn: cn(
        'w-100 h-10 mt-[30px] text-center leading-10 bg-[#00aeec] rounded-[8px] text-white cursor-pointer'
      ),
      stepItem: cn('relative flex flex-col items-center justify-center flex-1'),
      setPwdBefore: cn('font-normal text-sm leading-5 w-[76px] shrink-0 text-[#18191c]'),
    },
  })
  const { content, stepWp, itemWp, inputWp, btn, stepItem, setPwdBefore } = fpStyles()

  const [currentStep, setCurrentStep] = useState(1)

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      email: '',
      code: '',
    },
    mode: 'onChange',
  })

  const [routerCountDown, setRouterCountDown] = useState(5)

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setInterval(() => {
        setRouterCountDown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentStep])

  useEffect(() => {
    if (routerCountDown === 0) {
      window.location.href = '/'
    }
  }, [routerCountDown])

  const { findPassword } = useUserFindPassword()
  const { getByEmail } = useUserGetByEmail(emailForm.getValues('email'))
  const { handleSendCode, countdown } = useSendCode()

  const handleEmailSubmit = async () => {
    const { data } = await getByEmail()
    if (data?.code === 0) {
      passwordForm.setValue('email', emailForm.getValues('email'))
      emailForm.reset()
      setCurrentStep(2)
    }
  }

  const handlePasswordSubmit = async (values: PasswordValues) => {
    const { code } = await findPassword(values)
    if (code === 1) {
      return
    }
    toast('修改成功')
    setCurrentStep(3)
  }

  const onError: SubmitErrorHandler<EmailValues | PasswordValues> = (errors) => {
    toast(
      Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean)
        .join(',')
    )
  }

  return (
    <div className={content()}>
      {/* 步骤条 */}
      <div className={stepWp()}>
        {[
          { step: 1, title: '确认账号' },
          { step: 2, title: '重置密码' },
          { step: 3, title: '重置完成' },
        ].map((item) => (
          <div key={item.step} className={stepItem()}>
            <div
              className={cn(
                'size-6 rounded-full text-center text-sm leading-5.5 text-white',
                currentStep == item.step && 'bg-[#00aeec]',
                currentStep > item.step && "bg-[url('/svgs/right.svg')]",
                currentStep < item.step && 'border border-[#9499a0] text-[#9499a0] opacity-40'
              )}
            >
              {currentStep <= item.step && item.step}
            </div>
            <div
              className={cn(
                'mt-1 text-xs leading-[17px] font-normal',
                currentStep < item.step && 'text-[#9499a0]'
              )}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit, onError)} className={itemWp()}>
            <div className={inputWp()}>
              <span className='pr-5 text-sm leading-5 font-normal text-[#18191c]'>邮箱</span>
              <FormField
                control={emailForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        className='flex-1'
                        type='email'
                        placeholder='请输入绑定的邮箱'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type='submit'
              disabled={!emailForm.formState.isValid}
              className={cn(btn(), !emailForm.formState.isValid && 'cursor-not-allowed opacity-50')}
            >
              下一步
            </Button>
          </form>
        </Form>
      )}

      {currentStep === 2 && (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit, onError)}
            className={itemWp()}
          >
            <div className={inputWp()}>
              <span className={setPwdBefore()}>新密码</span>
              <FormField
                control={passwordForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        className='flex-1'
                        type='password'
                        placeholder='请输入新密码'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className={inputWp()}>
              <span className={setPwdBefore()}>确认密码</span>
              <FormField
                control={passwordForm.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        className='flex-1'
                        type='password'
                        placeholder='请再次输入新密码'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className={inputWp()}>
              <span className={setPwdBefore()}>邮箱</span>
              <span className={'flex-1 leading-5 font-normal text-[#18191c] select-none'}>
                {passwordForm.getValues('email')}
              </span>
              <Separator orientation={'vertical'} className={'mx-5 h-[26px]'} />
              <span
                onClick={() => {
                  setCurrentStep(1)
                  passwordForm.reset()
                }}
                className={'text-brand_blue shrink-0 cursor-pointer text-sm font-normal'}
              >
                修改
              </span>
            </div>

            <div className={inputWp()}>
              <span className={setPwdBefore()}>验证码</span>
              <FormField
                control={passwordForm.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='min-w-0 flex-1'>
                    <FormControl>
                      <Input
                        className='flex-1'
                        type='text'
                        placeholder='请输入验证码'
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator orientation={'vertical'} className={'mx-5 h-[26px]'} />
              <span
                className={cn(
                  'text-brand_blue w-[70px] shrink-0 cursor-pointer text-center text-sm leading-5 font-normal',
                  countdown &&
                    'w-[92px] cursor-not-allowed text-center text-sm leading-5 font-normal text-[#c9ccd0]'
                )}
                onClick={
                  countdown ? () => {} : () => handleSendCode(passwordForm.getValues('email'))
                }
              >
                {countdown ? `${countdown}s后重发` : '获取验证码'}
              </span>
            </div>

            <Button type='submit' className={btn()}>
              下一步
            </Button>
          </form>
        </Form>
      )}

      {currentStep === 3 && (
        <div className={itemWp()}>
          <div
            className={
              "mx-auto h-[158px] w-[280px] bg-[url('/images/success_icon.png')] bg-[size:100%_100%]"
            }
          ></div>
          <div className={'mt-2.5 text-center text-[16px] leading-5.5 font-medium text-[#18191c]'}>
            重置密码成功~
            <span className={'pl-2.5 text-xs text-[#61666d]'}>({routerCountDown}秒后继续跳转)</span>
          </div>
          <Button
            onClick={() => {
              window.location.href = '/'
            }}
            className={cn(btn())}
          >
            返回登录
          </Button>
        </div>
      )}
    </div>
  )
}

export default FindPasswordContent
