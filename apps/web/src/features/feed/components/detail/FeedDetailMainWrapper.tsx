'use client'

import { FeedGetById } from '@mtobdvlb/shared-types'
import { formatFeedDate, openNewTab } from '@/utils'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Tabs,
  TabsContent,
  UserHoverAvatar,
} from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import CommonDialog from '@/components/layout/models/common/CommonDialog'
import { cn, toast } from '@/lib'
import FeedCollapsibleContent from '@/features/feed/components/FeedCollapsibleContent'
import FeedImagesViewer from '@/features/feed/components/FeedImageViewer'
import FeedVideoContent from '@/features/feed/components/FeedVideoContent'
import FeedReferenceItem from '@/features/feed/components/FeedReferenceItem'
import { feedStyles, useFeedDelete, useUnFollow } from '@/features'
import { useUserStore } from '@/stores'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/ui/UserAvatar'
import { useState } from 'react'
import FeedDetailTabs from '@/features/feed/components/detail/FeedDetailTabs'
import CommentWrapper from '@/features/comment/components/CommentWrapper'
import FeedDetailLikeTranspontList from '@/features/feed/components/detail/FeedDetailLikeTranspontList'

export type FeedDetailTabsType = 'comment' | 'likeTranspont'

const FeedDetailMainWrapper = ({ feed }: { feed: FeedGetById }) => {
  const { main, avatar, header, body } = feedStyles()
  const userStore = useUserStore((state) => state.user)

  const { unfollow } = useUnFollow(feed.user.id)
  const { deleteFeed } = useFeedDelete()
  const router = useRouter()

  const [type, setType] = useState<FeedDetailTabsType>('comment')
  return (
    <div className={'pb-25 bg-bg1 rounded-t-[6px]'}>
      <div className={'bg-bg1 antialiased rounded-[6px] tracking-normal min-w-[556px] relative'}>
        <div className={'mb-2'}>
          <div className={cn(main(), feed.type === 'image-text' && 'pl-[56px] pr-[56px]')}>
            {feed.title && feed.type === 'image-text' && (
              <div className={'pt-10'}>
                <div
                  className={
                    'line-clamp-2 block text-[24px] font-bold leading-[36px] my-1 break-all break-words text-ellipsis'
                  }
                >
                  {feed.title}
                </div>
              </div>
            )}
            {feed.type === 'image-text' ? (
              <div className={'py-3 flex items-center'}>
                <div className={'size-12 shrink-0 '}>
                  <div
                    onClick={() => openNewTab(`/space/${feed.user.id}`)}
                    className={'size-full cursor-pointer rounded-full overflow-hidden'}
                  >
                    <UserAvatar avatar={feed.user.avatar} h={48} w={48} />
                  </div>
                </div>
                <div className={'flex-1 overflow-hidden pl-4'}>
                  <div
                    onClick={() => openNewTab(`/space/${feed.user.id}`)}
                    className={'text-text1 cursor-pointer text-[17px] font-[600] leading-6'}
                  >
                    {feed.user.name}
                  </div>
                  <div className={'flex items-center text-text3 pt-0.5 leading-4.5 text-[13px]'}>
                    {formatFeedDate(feed.publishedAt)}
                  </div>
                </div>
                <div className={'flex items-center justify-center shrink-0 h-12 min-w-25 relative'}>
                  <HoverCard openDelay={150} closeDelay={150}>
                    <HoverCardTrigger
                      className={
                        'text-text3 size-6 -right-1 hover:bg-bg1_float hover:text-text4 rounded-[4px] -top-[3px] cursor-pointer absolute'
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
                        <CommonDialog
                          handleConfirm={async () => {
                            const { code } = await unfollow({ followingId: feed.user.id })
                            if (code) return
                            toast('已取消关注')
                            router.replace('/feed')
                          }}
                          title={'取消关注'}
                          desc={`真的要取消对 ${feed.user.name} 的关注吗？`}
                          mainStyles={'blue'}
                          trigger={
                            <div
                              className={
                                'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                              }
                            >
                              <div className={'flex items-center '}>取消关注</div>
                            </div>
                          }
                        ></CommonDialog>
                      )}
                      {userStore?.id === feed.user.id && (
                        <CommonDialog
                          handleConfirm={async () => {
                            const { code } = await deleteFeed(feed.id)
                            if (code) return
                            toast('已删除')
                            router.replace('/feed')
                          }}
                          title={'要删除动态吗？'}
                          desc={'动态删除后将无法恢复，请谨慎操作'}
                          mainStyles={'red'}
                          trigger={
                            <div
                              className={
                                'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                              }
                            >
                              <div className={'flex items-center '}>删除</div>
                            </div>
                          }
                        ></CommonDialog>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            ) : (
              <>
                <div onClick={() => openNewTab(`/space/${feed.user.id}`)} className={avatar()}>
                  <UserHoverAvatar user={feed.user}>
                    <div className={'size-12 rounded-full relative overflow-hidden'}>
                      <Image fill src={feed.user.avatar} alt={feed.user.name} />
                    </div>
                  </UserHoverAvatar>
                </div>
                <div className={header()}>
                  <div className={'flex items-center h-[22px] mt-[1px] mb-0.5 max-w-fit'}>
                    <UserHoverAvatar user={feed.user}>
                      <Link
                        href={`/space/${feed.user.id}`}
                        target={'_blank'}
                        className={
                          'text-[17px] leading-8 text-text1 cursor-pointer font-semibold transition-all duration-200'
                        }
                      >
                        {feed.user.name}
                      </Link>
                    </UserHoverAvatar>
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
                            'text-graph_weak size-6 -right-1 hover:bg-graph_bg_regular rounded-[4px] -top-[3px] cursor-pointer absolute'
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
                            <CommonDialog
                              handleConfirm={async () => {
                                const { code } = await unfollow({ followingId: feed.user.id })
                                if (code) return
                                toast('已取消关注')
                                router.replace('/feed')
                              }}
                              title={'取消关注'}
                              desc={`真的要取消对 ${feed.user.name} 的关注吗？`}
                              mainStyles={'blue'}
                              trigger={
                                <div
                                  className={
                                    'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                                  }
                                >
                                  <div className={'flex items-center '}>取消关注</div>
                                </div>
                              }
                            ></CommonDialog>
                          )}
                          {userStore?.id === feed.user.id && (
                            <CommonDialog
                              handleConfirm={async () => {
                                const { code } = await deleteFeed(feed.id)
                                if (code) return
                                toast('已删除')
                                router.replace('/feed')
                              }}
                              title={'要删除动态吗？'}
                              desc={'动态删除后将无法恢复，请谨慎操作'}
                              mainStyles={'red'}
                              trigger={
                                <div
                                  className={
                                    'text-text2 cursor-pointer hover:bg-graph_bg_regular flex flex-col text-[13px] justify-center tracking-normal leading-4.5 min-h-10 py-2 px-[27px] select-none whitespace-nowrap'
                                  }
                                >
                                  <div className={'flex items-center '}>删除</div>
                                </div>
                              }
                            ></CommonDialog>
                          )}
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className={body()}>
              <div className={'mt-3'}>
                <div className={'-mt-1'}>
                  {feed.title && feed.type !== 'image-text' && (
                    <Link
                      href={``}
                      className={
                        'line-clamp-2 cursor-pointer block text-[15px] font-bold leading-[25px] my-1 break-all break-words text-ellipsis'
                      }
                    >
                      {feed.title}
                    </Link>
                  )}
                  {feed.content && (
                    <div>
                      <FeedCollapsibleContent
                        isLink={false}
                        isExpand
                        feedId={feed.id}
                        content={feed.content}
                      />
                    </div>
                  )}
                  {!!feed.images?.length && (
                    <div className={'mt-3 font-normal antialiased'}>
                      <FeedImagesViewer isExpand images={feed.images} />
                    </div>
                  )}
                  {feed.video && (
                    <div>
                      <FeedVideoContent feed={feed} />
                    </div>
                  )}
                  {feed.referenceId && (
                    <div className={'bg-bg2 rounded-[6px] mt-3 p-5'}>
                      <FeedReferenceItem isExpand feedId={feed.referenceId} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tabs
        onValueChange={(value) => setType(value as FeedDetailTabsType)}
        value={type}
        id={'feed-detail-tabs'}
        className={'mt-5 block'}
      >
        <FeedDetailTabs type={type} feed={feed} setType={setType} />
        <TabsContent className={'pt-5 px-[56px]'} value={'comment'}>
          <CommentWrapper feedId={feed.id} />
        </TabsContent>
        <TabsContent value={'likeTranspont'} className={'py-3 px-[56px]'}>
          <FeedDetailLikeTranspontList feedId={feed.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FeedDetailMainWrapper
