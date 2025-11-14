'use client'

import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import { cn } from '@/lib'
import LoginModelPassword from '@/components/layout/models/login-model/LoginModelPassword'
import LoginModelCode from '@/components/layout/models/login-model/LoginModelCode'
import { useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'
import { useUserStore } from '@/stores'
import { useRouter } from 'next/navigation'

const loginFormStyles = tv({
  slots: {
    item: 'relative flex justify-start items-center w-full h-11 py-3 px-5',
    label: 'flex-nowrap whitespace-nowrap block shrink-0 m-0 p-0 font-normal',
    input: 'flex-1 min-w-0 ml-5 border-none shadow-[inset_0_0_0_1000px_#fff] focus-visible:ring-0 ',
    btnWrap: 'flex justify-between mt-5 w-100 font-normal leading-10 text-center',
    btnOther:
      'w-[194px] shadow-none h-10 cursor-pointer hover:bg-white font-normal text-[#18191c] bg-white border border-[#e3e5e7] rounded-[8px] m-0 p-0',
    btnPrimary:
      'bg-[#00aeec] shadow-none w-[194px] h-10 cursor-pointer font-normal hover:bg-[#00aeec] hover:opacity-85 text-white rounded-[8px] m-0 p-0',
  },
})

const LoginWrapper = () => {
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  const formStyles = loginFormStyles()

  const [tabsValue, setTabsValue] = useState<'password' | 'code'>('password')

  useEffect(() => {
    if (!user?.id) return
    // history.length > 1 才能正常返回
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }, [user?.id, router])

  return (
    <Tabs className={'flex flex-col justify-center items-center w-full'} value={tabsValue}>
      <TabsList
        className={'m-0 mb-6 flex w-full justify-center border-none bg-transparent p-0'}
        defaultValue={'password'}
      >
        <TabsTrigger
          onClick={() => setTabsValue('password')}
          className={cn(
            'focus-visible:shadow-none focus-visible:ring-0 data-[state=active]:shadow-none',
            'm-0 cursor-pointer p-0 text-lg leading-5 font-medium text-[#505050] data-[state=active]:cursor-not-allowed data-[state=active]:text-[#4fa5d9]'
          )}
          value={'password'}
        >
          密码登录
        </TabsTrigger>
        <Separator
          className={'mx-[21px] my-0 h-5 rounded-[8px] bg-[#e3e5e7] p-0'}
          orientation={'vertical'}
        />
        <TabsTrigger
          onClick={() => setTabsValue('code')}
          className={cn(
            'focus-visible:shadow-none focus-visible:ring-0 data-[state=active]:shadow-none',
            'm-0 cursor-pointer p-0 text-lg leading-5 font-medium text-[#505050] data-[state=active]:cursor-not-allowed data-[state=active]:text-[#4fa5d9]'
          )}
          value={'code'}
        >
          邮箱登录
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className={
          'text-text1 relative m-0 rounded-none p-0 text-sm leading-[1.6] font-normal select-none'
        }
        value={'password'}
      >
        <LoginModelPassword
          isPasswordOpen={isPasswordOpen}
          setIsPasswordOpen={setIsPasswordOpen}
          formStyles={formStyles}
          setTabsValue={setTabsValue}
        />
      </TabsContent>
      <TabsContent
        className={
          'text-text1 relative m-0 rounded-none p-0 text-sm leading-[1.6] font-normal select-none'
        }
        value={'code'}
      >
        <LoginModelCode formStyles={formStyles} />
      </TabsContent>
    </Tabs>
  )
}

export default LoginWrapper
