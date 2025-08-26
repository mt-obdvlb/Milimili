'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useUiStore } from '@/stores/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib'
import { tv } from 'tailwind-variants'
import { useState } from 'react'
import LoginModelCode from '@/components/layout/login-model/LoginModelCode'
import LoginModelPassword from '@/components/layout/login-model/LoginModelPassword'

const form = tv({
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

export type LoginModelFormStyles = ReturnType<typeof form>

const LoginModel = () => {
  const uiState = useUiStore((state) => state)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

  const [tabsValue, setTabsValue] = useState<'password' | 'code'>('password')

  const formStyles = form()

  return (
    <Dialog open={uiState.loginModel}>
      <DialogContent showCloseButton={false} className={'m-0 h-auto min-h-auto w-auto p-0'}>
        <DialogTitle hidden></DialogTitle>

        <div
          className={cn(
            `fixed top-1/2 left-1/2 box-border min-h-[430px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-[#fff] bg-[url('/images/login-model-left.png'),url('/images/login-model-right.png')] bg-[length:14%] bg-position-[0_100%,100%_100%] bg-no-repeat p-[52px_65px_29px_92px] select-none`,
            passwordFocus &&
              "bg-[url('/images/login-model-left-hd.png'),url('/images/login-model-right-hd.png')]"
          )}
        >
          <div
            onClick={() => uiState.setLoginModel(false)}
            className={
              "absolute top-5 right-5 z-2 size-[32px] cursor-pointer bg-[url('/svgs/x.svg')] bg-position-[100%_100%]"
            }
          ></div>
          <div className={'flex w-full flex-col items-center'}>
            <Tabs value={tabsValue} className={'w-[400px] bg-transparent'}>
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
                  setPasswordFocus={setPasswordFocus}
                />
              </TabsContent>
              <TabsContent
                className={
                  'text-text1 relative m-0 rounded-none p-0 text-sm leading-[1.6] font-normal select-none'
                }
                value={'code'}
              >
                <LoginModelCode setPasswordFocus={setPasswordFocus} formStyles={formStyles} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModel
