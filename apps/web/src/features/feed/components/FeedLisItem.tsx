'use client'

import { FeedListItem as FeedListItemType } from '@mtobdvlb/shared-types'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import Image from 'next/image'
import { formatFeedDate } from '@/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components'
import { useUserStore } from '@/stores'
import FeedCollapsibleContent from '@/features/feed/components/FeedCollapsibleContent'
import FeedImagesViewer from '@/features/feed/components/FeedImageViewer'

const FeedListItem = ({ feed }: { feed: FeedListItemType }) => {
  const feedStyles = tv({
    slots: {
      root: cn(
        'antialiased bg-bg1 rounded-[6px] font-normal tracking-normal min-w-[556px] relative'
      ),
      main: cn('pr-5 pl-22'),
      avatar: cn('items-center flex h-[86.4px] justify-center left-0 absolute top-0 w-[86.4]'),
      header: cn('h-[62px] pt-4'),
      body: cn('mt-2'),
      footer: cn('flex h-[50px] justify-between pr-5'),
    },
  })
  const { root, main, avatar, header, body, footer } = feedStyles()
  const userStore = useUserStore((state) => state.user)

  return (
    <div className={'mb-2'}>
      <div className={root()}>
        <div className={main()}>
          <div className={avatar()}>
            <div className={'size-12 rounded-full relative overflow-hidden'}>
              <Image fill src={feed.user.avatar} alt={feed.user.name} />
            </div>
          </div>
          <div className={header()}>
            <div className={'flex items-center h-[22px] mt-[1px] mb-0.5 max-w-fit'}>
              <span
                className={
                  'text-[17px] leading-8 text-text1 cursor-pointer font-semibold transition-all duration-200'
                }
              >
                {feed.user.name}
              </span>
            </div>
            <div className={'items-center flex pr-30 pt-1'}>
              <span
                className={
                  'text-[13px] leading-4.5 text-ellipsis break-all break-words line-clamp-1 text-text3 cursor-pointer transition-colors duration-300 ease-in-out select-none w-fit overflow-hidden'
                }
              >
                {formatFeedDate(feed.publishedAt)} {feed.type === 'video' && ' · 投稿了视频'}
              </span>
            </div>
            <div className={'absolute right-4 top-[30px] '}>
              <div className={'rounded-[4px] size-6'}>
                <HoverCard openDelay={150} closeDelay={150}>
                  <HoverCardTrigger
                    className={
                      'text-graph_weak size-6 -right-1 hover:bg-graph_bg_regular -top-[3px] cursor-pointer absolute'
                    }
                  >
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M13.7485 5.49841C13.7485 6.46404 12.9657 7.24683 12.0001 7.24683C11.0344 7.24683 10.2516 6.46404 10.2516 5.49841C10.2516 4.53279 11.0344 3.75 12.0001 3.75C12.9657 3.75 13.7485 4.53279 13.7485 5.49841ZM13.7484 18.4982C13.7484 19.4639 12.9656 20.2467 11.9999 20.2467C11.0343 20.2467 10.2515 19.4639 10.2515 18.4982C10.2515 17.5326 11.0343 16.7498 11.9999 16.7498C12.9656 16.7498 13.7484 17.5326 13.7484 18.4982ZM11.9999 13.7487C12.9656 13.7487 13.7484 12.9658 13.7484 12.0002C13.7484 11.0345 12.9656 10.2517 11.9999 10.2517C11.0343 10.2517 10.2515 11.0345 10.2515 12.0002C10.2515 12.9658 11.0343 13.7487 11.9999 13.7487Z'
                        fill='currentColor'
                      ></path>
                    </svg>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align={'end'}
                    className={
                      'z-2018 -mr-[3px] max-h-[500px] min-w-[142px] py-3 px-0 overflow-y-auto '
                    }
                  >
                    {userStore?.id !== feed.user.id && (
                      <div
                        className={
                          'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                        }
                      >
                        <div className={'flex items-center '}>取消关注</div>
                      </div>
                    )}

                    {userStore?.id === feed.user.id && (
                      <div
                        className={
                          'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                        }
                      >
                        <div className={'flex items-center '}>删除</div>
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
          <div className={body()}>
            <div className={'mt-3'}>
              <div className={'-mt-1'}>
                {feed.title && (
                  <div
                    className={
                      'line-clamp-2 cursor-pointer text-[15px] font-bold leading-[25px] my-1 break-all break-words text-ellipsis'
                    }
                  >
                    {feed.title}
                  </div>
                )}
                {feed.content && (
                  <div>
                    <FeedCollapsibleContent content={feed.content} />
                  </div>
                )}
                {!!feed.images?.length && (
                  <div className={'mt-3 font-normal antialiased'}>
                    <FeedImagesViewer images={feed.images} />
                  </div>
                )}
                {feed.video && <div></div>}
                {feed.referenceId && <div></div>}
              </div>
            </div>
          </div>
          <div className={footer()}></div>
        </div>
      </div>
    </div>
  )
}

export default FeedListItem
