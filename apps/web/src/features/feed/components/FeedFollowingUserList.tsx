'use client'

import { useFeedGetFollowingList } from '@/features'
import { Dispatch, SetStateAction, useRef } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger } from '@/components'
import { useCanScroll } from '@/hooks/useCanScroll'

const FeedFollowingUserList = ({
  userId,
  setUserId,
}: {
  userId: string
  setUserId: Dispatch<SetStateAction<string>>
}) => {
  const { followingList } = useFeedGetFollowingList()
  const ref = useRef<HTMLDivElement>(null)

  const feedUserStyles = tv({
    slots: {
      item: 'items-center group cursor-pointer flex flex-col shrink-0 h-25 mr-1.5 pt-2 w-[68px]',
      face: cn(
        'border border-bg1  box-content rounded-full shadow-[0_0_0_1px_var(--bg1)] shrink-0 size-12 m-[1px] relative group-hover:shadow-[0_0_0_1px_var(--brand_blue)] in-data-[state=active]:shadow-[0_0_0_1px_var(--brand_blue)] '
      ),
      name: cn(
        'line-clamp-2 in-data-[state=active]:text-brand_blue group-hover:text-brand_blue break-words break-all text-text2 text-ellipsis text-[13px] tracking-normal leading-4.5 mt-1 text-center select-none'
      ),
    },
  })

  const navStyles = tv({
    slots: {
      base: cn(
        'flex h-full opacity-0 group-hover/fa:opacity-100 absolute transition-opacity duration-350 z-1'
      ),
      shim: cn('bg-bg1 h-full w-2'),
      shadow: cn('items-center flex h-full'),
      btn: cn(
        'items-center bg-bg1 border border-line_regular  rounded-full text-graph_medium  cursor-pointer flex h-6 justify-center w-6'
      ),
    },
  })

  const { item, face, name } = feedUserStyles()
  const { base, btn, shim, shadow } = navStyles()

  // 更新左右滚动状态

  const { canScrollRight, canScrollLeft } = useCanScroll<HTMLDivElement>(ref, followingList)

  return (
    <section className='mb-2 w-full'>
      <Tabs
        value={userId}
        onValueChange={setUserId}
        className='w-full items-center group/fa bg-bg1 rounded-[6px] flex flex-row relative'
      >
        {/* 左箭头 */}
        <div className={cn(base(), 'left-0')} style={{ display: canScrollLeft ? 'block' : 'none' }}>
          <div className={cn(shim(), 'rounded-l-[6px]')}></div>
          <div className={cn(shadow(), 'bg-[linear-gradient(270deg,hsla(0,0%,100%,0),var(--bg1)]')}>
            <div
              onClick={() => ref.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className={btn()}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12'>
                <path
                  d='M7.72855 1.521445C7.9238 1.71671 7.9238 2.03329 7.72855 2.228555L4.04549 5.9116C3.996675 5.96045 3.996675 6.03955 4.04549 6.0884L7.72855 9.77145C7.9238 9.9667 7.9238 10.2833 7.72855 10.47855C7.5333 10.6738 7.2167 10.6738 7.02145 10.47855L3.338385 6.7955C2.899045 6.35615 2.899045 5.64385 3.338385 5.2045L7.02145 1.521445C7.2167 1.326185 7.5333 1.326185 7.72855 1.521445z'
                  fill='currentColor'
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* 滚动容器 */}
        <div ref={ref} className='flex-1 overflow-x-auto overflow-y-hidden pt-[9px] pb-[10px] '>
          <TabsList className={'flex  transition-transform duration-350'}>
            <div className={'shrink-0 w-2'}></div>
            <TabsTrigger value={''} className={item()}>
              <div
                className={cn(
                  face(),
                  "items-center bg-[#b9e9f9] bg-center bg-no-repeat bg-cover flex justify-center bg-[url('/images/all-feed.png')]  "
                )}
              ></div>
              <div className={name()}>全部动态</div>
            </TabsTrigger>
            {followingList?.map((user) => (
              <TabsTrigger value={user.userId} className={item()} key={user.userId}>
                <div className={face()}>
                  <div className={'rounded-full size-full overflow-hidden relative'}>
                    <Image src={user.avatar} fill alt={user.name} />
                  </div>
                </div>
                <div className={name()}> {user.name}</div>
              </TabsTrigger>
            ))}
            <div className={'shrink-0 w-2'}></div>
          </TabsList>
        </div>

        {/* 右箭头 */}
        <div
          className={cn(base(), 'right-0 flex-row-reverse')}
          style={{ display: canScrollRight ? 'block' : 'none' }}
        >
          <div className={cn(shim(), 'rounded-r-[6px]')}></div>
          <div className={cn(shadow(), 'bg-[linear-gradient(90deg,hsla(0,0%,100%,0),var(--bg1)]')}>
            <div
              onClick={() => ref.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className={btn()}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12'>
                <path
                  d='M4.27145 1.521445C4.076185 1.71671 4.076185 2.03329 4.27145 2.228555L7.9545 5.9116C8.0033 5.96045 8.0033 6.03955 7.9545 6.0884L4.27145 9.77145C4.076185 9.9667 4.076185 10.2833 4.27145 10.47855C4.46671 10.6738 4.783295 10.6738 4.978555 10.47855L8.6616 6.7955C9.10095 6.35615 9.10095 5.64385 8.6616 5.2045L4.978555 1.521445C4.783295 1.326185 4.46671 1.326185 4.27145 1.521445z'
                  fill='currentColor'
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </Tabs>
    </section>
  )
}

export default FeedFollowingUserList
