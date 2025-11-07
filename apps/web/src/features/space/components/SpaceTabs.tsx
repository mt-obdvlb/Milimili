'use client'

import { UserGetInfo } from '@mtobdvlb/shared-types'
import { Label, Tabs, TabsList } from '@/components'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib'
import { LayoutGroup, motion } from 'motion/react'
import Link from 'next/link'

type SpaceTabs = '' | 'feed' | 'upload' | 'fans' | 'follow' | 'favorite'

const tabs = [
  { name: '主页', value: '', icon: cn('sic-BDC-house_home_line text-[#0EB350]') },
  { name: '动态', value: 'feed', icon: cn('sic-BDC-windmill_moments_line text-[#FF6699]') },
  {
    name: '投稿',
    value: 'upload',
    icon: cn('sic-fsp-submission_line text-[#00AEEC]'),
    href: 'upload/video',
  },
  { name: '收藏', value: 'favorite', icon: cn('sic-fsp-fav_line text-[#FFB027]') },
]

const getTabValue = (last: string, secondLast: string) => {
  let current: SpaceTabs
  if (secondLast === 'relation') {
    current = last as SpaceTabs // relation/fans or relation/follow
  } else if (secondLast === 'upload') {
    current = secondLast as SpaceTabs
  } else if (['feed', 'upload', 'favorite'].includes(last)) {
    current = last as SpaceTabs
  } else {
    current = '' // 默认主页
  }
  return current
}

const SpaceTabs = ({ user }: { user: UserGetInfo }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [select, setSelect] = useState<SpaceTabs>(() => {
    const parts = pathname.split('/').filter(Boolean) // 去掉空字符串
    const last = parts[parts.length - 1]
    const secondLast = parts[parts.length - 2]
    if (!last || !secondLast) return ''
    return getTabValue(last, secondLast)
  })

  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean) // 去掉空字符串
    const last = parts[parts.length - 1]
    const secondLast = parts[parts.length - 2]
    if (!last || !secondLast) return

    setSelect(getTabValue(last, secondLast))
  }, [pathname])

  return (
    <Tabs className={'block'}>
      <TabsList
        className={'min-w-[1100px] flex items-center justify-between max-w-[2260px] mx-auto px-15'}
      >
        <div className={'shrink-0 flex items-center mr-[15px]'}>
          <LayoutGroup id='space-tabs'>
            <div className='relative flex  items-center'>
              {tabs.map((item) => {
                const isActive = item.value === select
                return (
                  <motion.div
                    key={item.value}
                    layout
                    className='relative flex pointer-events-none items-center justify-center h-16 not-first-of-type:ml-[30px]'
                  >
                    <Link
                      prefetch={'auto'}
                      href={`/space/${user.id}/${item.href || item.value}`}
                      className='flex items-center justify-center pointer-events-auto size-full  relative'
                    >
                      <i
                        className={cn(
                          'font-normal text-[20px] leading-[1] align-baseline inline-block transition-colors duration-300',
                          item.icon
                        )}
                      ></i>
                      <span
                        className={cn(
                          'transition-colors text-text1 ml-1 hover:text-brand_blue text-[16px]',
                          isActive && 'text-brand_blue font-bold'
                        )}
                      >
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId='space-tab-indicator'
                          className='absolute inset-x-0 bottom-0 bg-brand_blue h-[3px] rounded-[3px]'
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </LayoutGroup>
          <Label className={'ml-[30px]'}></Label>
        </div>
        <div className={'shrink-0'}>
          <div className={'flex items-center'}>
            {[
              {
                name: '关注数',
                num: user.followings,
                value: 'follow',
              },
              { name: '粉丝数', num: user.followers, value: 'fans' },
            ].map((item) => (
              <Link
                className={
                  'cursor-pointer not-first-of-type:ml-4 group flex flex-col items-center min-w-[52px]'
                }
                key={item.value}
                href={`/space/${user.id}/relation/${item.value}`}
                onClick={() => {
                  router.push(`/space/${user.id}/relation/${item.value}`)
                }}
              >
                <span
                  className={cn(
                    'transition-colors group-hover:text-brand_blue duration-300 text-[13px] leading-4.5 text-text2',
                    select === item.value ? 'text-brand_blue' : ''
                  )}
                >
                  {item.name}
                </span>
                <span
                  className={cn(
                    'transition-colors duration-300 text-sm leading-5 group-hover:text-brand_blue mt-0.5 font-medium text-text1',
                    select === item.value ? 'text-brand_blue' : ''
                  )}
                >
                  {item.num}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </TabsList>
    </Tabs>
  )
}

export default SpaceTabs
