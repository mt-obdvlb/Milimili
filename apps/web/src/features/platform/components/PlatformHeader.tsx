'use client'

import Link from 'next/link'
import { Badge, HoverCard, HoverCardContent, HoverCardTrigger, Separator } from '@/components'
import Image from 'next/image'
import { useUserStore } from '@/stores'
import { useMessageStatistics, useUserLogout } from '@/features'
import dayjs from 'dayjs'
import { cn } from '@/lib'
import React from 'react'

const PlatformHeader = () => {
  const user = useUserStore((state) => state.user)
  const { messageStatistics: notificationStatistics } = useMessageStatistics()

  const { logout } = useUserLogout()
  if (!user?.id) return null
  return (
    <div
      className={
        'h-15 flex items-center justify-between pr-25 pl-8 bg-white shadow-[0_2px_10px_0_rgba(0,0,0,.05)] mr-[calc(-100vw+100%)]'
      }
    >
      <div className={'flex items-center'}>
        <Link
          href={'/'}
          className={'ml-8 flex items-center text-sm text-[#757575] cursor-pointer'}
          target={'_blank'}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={'mr-1 size-4 text-[16px]'}
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z'
              fill='currentColor'
            ></path>
          </svg>
          主站
        </Link>
      </div>
      <div className={'flex items-center text-[16px] text-[#757575]'}>
        <span className={'pl-10 cursor-pointer'}>
          <HoverCard openDelay={10} closeDelay={50}>
            <HoverCardTrigger asChild>
              <Link href={`/space`} target={'_blank'} className={' cursor-pointer flex'}>
                <Image
                  src={user!.avatar}
                  alt={user!.name}
                  width={28}
                  height={28}
                  className={'rounded-full bg-[#ccc] border border-[#f4f4f4]'}
                />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              sideOffset={15}
              className={
                'w-[144px] z-2013 bg-[#fff] outline-none rounded-[4px] border border-[#ebeef5] text-[#606266] leading-[1.4] text-[14px] shadow-[0_2px_12px_0_rgba(0,0,0,.1)] break-all'
              }
            >
              <div className={'size-full relative'}>
                <div>
                  <Link
                    className={
                      'h-10 cursor-pointer justify-center flex  items-center hover:bg-[#fafafa]'
                    }
                    href={'/account'}
                  >
                    个人中心
                  </Link>
                  <Link
                    className={
                      'h-10 cursor-pointer justify-center flex  items-center hover:bg-[#fafafa]'
                    }
                    href={'/apps/web/src/app/(with-auth)/platform/upload-manager'}
                  >
                    投稿管理
                  </Link>
                </div>
                <div className={'pt-[9px] pb-0.5'}>
                  <Separator
                    orientation={'horizontal'}
                    className={'w-[96px] h-[1px] mx-auto bg-[#f4f4f4]'}
                  ></Separator>
                  <Link
                    className={
                      'h-10 cursor-pointer justify-center flex  items-center hover:bg-[#fafafa]'
                    }
                    href={'/'}
                    onClick={() => logout()}
                  >
                    退出登录
                  </Link>
                </div>
                <div
                  className={
                    'absolute outline-none size-0 border-transparent left-[64.5px] -top-1.5 mr-[3px] border-6 border-t-0  border-b-[#ebeef5]  drop-shadow-[0_2px_12px_rgba(0,0,0,.03)]'
                  }
                >
                  <div
                    className={
                      'top-[1px] -ml-1.5 border-transparent outline-none border-6 border-t-0 border-b-white absolute size-0  '
                    }
                  ></div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </span>
        <div
          className={
            'bg-[rgba(250,143,87,.1)] border border-[rgba(250,142,87,.43)] rounded-[14px] py-[5px] pr-3 pl-4 text-xs text-[#fa8e57] text-center mr-8 ml-3'
          }
        >
          成为UP主的第{Math.ceil(dayjs().diff(user.createdAt, 'day'))}天
        </div>
        <Separator orientation={'vertical'} className={'w-[1px] h-4 bg-[#e7e7e7] mr-8'} />
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link
              target={'_blank'}
              href={'/message'}
              className={
                'relative flex min-w-[50px] cursor-pointer flex-col items-center justify-center'
              }
            >
              <div>
                {' '}
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.435 17.7717H4.567C2.60143 17.7717 1 16.1723 1 14.2047V5.76702C1 3.80144 2.59942 2.20001 4.567 2.20001H15.433C17.3986 2.20001 19 3.79943 19 5.76702V14.2047C19.002 16.1703 17.4006 17.7717 15.435 17.7717ZM4.567 4.00062C3.59327 4.00062 2.8006 4.79328 2.8006 5.76702V14.2047C2.8006 15.1784 3.59327 15.9711 4.567 15.9711H15.433C16.4067 15.9711 17.1994 15.1784 17.1994 14.2047V5.76702C17.1994 4.79328 16.4067 4.00062 15.433 4.00062H4.567Z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M9.99943 11.2C9.51188 11.2 9.02238 11.0667 8.59748 10.8019L8.5407 10.7635L4.3329 7.65675C3.95304 7.37731 3.88842 6.86226 4.18996 6.50976C4.48954 6.15544 5.0417 6.09699 5.4196 6.37643L9.59412 9.45943C9.84279 9.60189 10.1561 9.60189 10.4067 9.45943L14.5812 6.37643C14.9591 6.09699 15.5113 6.15544 15.8109 6.50976C16.1104 6.86409 16.0478 7.37731 15.6679 7.65675L11.4014 10.8019C10.9765 11.0667 10.487 11.2 9.99943 11.2Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </div>

              <Badge
                variant='destructive'
                className={
                  'absolute top-0 left-[35px] z-1 size-1.5 p-0 rounded-full bg-[#fa5a57] text-white'
                }
              />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            className={cn(
              'bg-bg1_float box-[0_0_30px_rgba(0,0,0,0.1)] border-line_regular text-text1 relative m-0 w-auto rounded-[8px] border p-0'
            )}
            sideOffset={20}
            autoFocus={false}
          >
            <div className={'w-[142px] overflow-hidden'}>
              <div className={'flex flex-col py-3'}>
                {[
                  {
                    url: 'reply',
                    name: '回复我的',
                    number:
                      notificationStatistics?.find((item) => item.type === 'reply')?.count ?? 0,
                  },
                  {
                    url: 'at',
                    name: '@我的',
                    number: notificationStatistics?.find((item) => item.type === 'at')?.count ?? 0,
                  },
                  {
                    url: 'love',
                    name: '收到的赞',
                    number:
                      notificationStatistics?.find((item) => item.type === 'like')?.count ?? 0,
                  },
                  {
                    url: 'system',
                    name: '系统消息',
                    number:
                      notificationStatistics?.find((item) => item.type === 'system')?.count ?? 0,
                  },
                  {
                    url: 'whisper',
                    name: '我的消息',
                    number:
                      notificationStatistics?.find((item) => item.type === 'whisper')?.count ?? 0,
                  },
                ].map((item) => (
                  <Link
                    key={item.url}
                    className={
                      'text-text2 hover:bg-graph_bg_thick relative flex cursor-pointer items-center py-2.5 pl-[27px] text-left text-sm transition-colors duration-300'
                    }
                    target={'_blank'}
                    href={`/apps/web/src/app/(with-auth)/message/${item.url}`}
                  >
                    {item.name}
                    {!!item.number && (
                      <Badge
                        variant={'destructive'}
                        className={cn(
                          'absolute right-[17px] m-0 rounded-[8px] bg-[#fa5a57] p-0 px-[5px] text-xs leading-4 text-white'
                        )}
                      >
                        {item.number > 99 ? '99+' : item.number}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}

export default PlatformHeader
