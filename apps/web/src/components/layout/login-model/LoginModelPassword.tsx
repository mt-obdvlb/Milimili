'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Image from 'next/image'
import { openNewTable } from '@/utils/openNewTable'
import { Button } from '@/components/ui/button'
import { LoginModelFormStyles } from '@/components/layout/login-model/LoginModel'
import { Dispatch, SetStateAction } from 'react'

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
  setPasswordFocus: Dispatch<SetStateAction<boolean>>
}) => {
  const { input, btnOther, btnPrimary, btnWrap, label, item } = formStyles

  return (
    <>
      <form
        className={'h-[90px] w-full rounded-[8px] border border-[#e3e5e7] leading-5 text-[#212121]'}
      >
        <div className={item()}>
          <Label className={label()} htmlFor={'email'}>
            账号
          </Label>
          <Input
            className={input()}
            type={'text'}
            id={'email'}
            name={'email'}
            placeholder={'请输入账号'}
          />
        </div>
        <Separator className={'my-0'} />
        <div className={item()}>
          <Label className={label()} htmlFor={'password'}>
            密码
          </Label>
          <Input
            className={input()}
            type={isPasswordOpen ? 'text' : 'password'}
            id={'password'}
            name={'password'}
            placeholder={'请输入密码'}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          <div
            onClick={() => setIsPasswordOpen(!isPasswordOpen)}
            className={'relative mr-[10px] inline-block size-5 cursor-pointer'}
          >
            <svg
              data-v-1a96ced4=''
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
              className={'size-5 text-[#9499A0] hover:text-[#00a1d6]'}
            >
              {isPasswordOpen ? (
                <path
                  data-v-1a96ced4=''
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2.11069 9.43732C3.21647 7.77542 5.87904 4.58331 9.89458 4.58331C13.8801 4.58331 16.6483 7.72502 17.8345 9.4049C18.0905 9.76747 18.0905 10.2325 17.8345 10.5951C16.6483 12.2749 13.8801 15.4166 9.89458 15.4166C5.87904 15.4166 3.21647 12.2245 2.11069 10.5626C1.88009 10.2161 1.88009 9.7839 2.11069 9.43732ZM9.89458 3.33331C5.19832 3.33331 2.20919 7.03277 1.07001 8.74489C0.560324 9.51091 0.560323 10.4891 1.07001 11.2551C2.20919 12.9672 5.19832 16.6666 9.89458 16.6666C14.5412 16.6666 17.6368 13.0422 18.8556 11.3161C19.4168 10.5213 19.4168 9.4787 18.8556 8.68391C17.6368 6.95774 14.5412 3.33331 9.89458 3.33331ZM7.29165 9.99998C7.29165 8.50421 8.50421 7.29165 9.99998 7.29165C11.4958 7.29165 12.7083 8.50421 12.7083 9.99998C12.7083 11.4958 11.4958 12.7083 9.99998 12.7083C8.50421 12.7083 7.29165 11.4958 7.29165 9.99998ZM9.99998 6.04165C7.81385 6.04165 6.04165 7.81385 6.04165 9.99998C6.04165 12.1861 7.81385 13.9583 9.99998 13.9583C12.1861 13.9583 13.9583 12.1861 13.9583 9.99998C13.9583 7.81385 12.1861 6.04165 9.99998 6.04165Z'
                  fill='currentColor'
                ></path>
              ) : (
                <path
                  data-v-1a96ced4=''
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z'
                  fill='currentColor'
                ></path>
              )}
            </svg>
          </div>

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
                  onClick: () => {
                    setTabsValue('code')
                  },
                },
                {
                  title: '去找回密码',
                  desc: '通过绑定的邮箱重置密码',
                  onClick: () => {
                    openNewTable('/find-password')
                  },
                },
              ].map((item) => (
                <div
                  key={item.title}
                  onClick={item.onClick}
                  className={'m-0 cursor-pointer py-[11px] pr-0 pl-[18px]'}
                >
                  <p className={'align-baseline text-sm leading-4.5 font-normal text-[#212121]'}>
                    {item.title}
                  </p>
                  <p className={'align-baseline text-xs leading-4.5 font-normal text-[#999]'}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </form>
      <div className={btnWrap()}>
        <Button onClick={() => setTabsValue('code')} variant={'outline'} className={btnOther()}>
          注册
        </Button>
        <Button type={'submit'} className={btnPrimary()}>
          登录
        </Button>
      </div>
    </>
  )
}

export default LoginModelPassword
