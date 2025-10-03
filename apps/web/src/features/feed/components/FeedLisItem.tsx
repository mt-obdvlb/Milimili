'use client'

import { FeedListItem as FeedListItemType } from '@mtobdvlb/shared-types'
import { tv } from 'tailwind-variants'
import { cn, toast } from '@/lib'
import Image from 'next/image'
import { formatFeedDate, openNewTab } from '@/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger, UserHoverAvatar } from '@/components'
import { useUserStore } from '@/stores'
import FeedCollapsibleContent from '@/features/feed/components/FeedCollapsibleContent'
import FeedImagesViewer from '@/features/feed/components/FeedImageViewer'
import { useFeedDelete, useLike, useLikeGet, useUnFollow } from '@/features'
import CommonDialog from '@/components/layout/models/common/CommonDialog'
import { useState } from 'react'
import CommentWrapper from '@/features/comment/components/CommentWrapper'
import FeedTranspontContent from '@/features/feed/components/FeedTranspontContent'
import FeedVideoContent from '@/features/feed/components/FeedVideoContent'
import FeedReferenceItem from '@/features/feed/components/FeedReferenceItem'
import Link from 'next/link'

export const feedStyles = tv({
  slots: {
    root: cn('antialiased bg-bg1 rounded-[6px] font-normal tracking-normal min-w-[556px] relative'),
    main: cn('pr-5 pl-22'),
    avatar: cn(
      'items-center cursor-pointer flex h-[86.4px] justify-center left-0 absolute top-0 w-[86.4]'
    ),
    header: cn('h-[62px] pt-4 '),
    body: cn('mt-2'),
    footer: cn('flex h-[50px] justify-between pr-5'),
    panel: cn('pb-0.5 w-full'),
  },
})

const FeedListItem = ({ feed }: { feed: FeedListItemType }) => {
  const { root, main, avatar, header, body, footer, panel } = feedStyles()
  const userStore = useUserStore((state) => state.user)
  const { deleteFeed } = useFeedDelete()
  const { isLike } = useLikeGet({ feedId: feed.id })
  const { like, unlike } = useLike({ feedId: feed.id })
  const { unfollow } = useUnFollow(feed.user.id)
  const [panelOpen, setPanelOpen] = useState<'comment' | 'transpont' | null>(null)

  return (
    <div className={'mb-2'}>
      <div className={root()}>
        <div className={main()}>
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
          <div className={body()}>
            <div className={'mt-3'}>
              <div className={'-mt-1'}>
                {feed.title && (
                  <Link
                    href={`/feed/${feed.id}`}
                    className={
                      'line-clamp-2 cursor-pointer block text-[15px] font-bold leading-[25px] my-1 break-all break-words text-ellipsis'
                    }
                  >
                    {feed.title}
                  </Link>
                )}
                {feed.content && (
                  <div>
                    <FeedCollapsibleContent feedId={feed.id} content={feed.content} />
                  </div>
                )}
                {!!feed.images?.length && (
                  <div className={'mt-3 font-normal antialiased'}>
                    <FeedImagesViewer images={feed.images} />
                  </div>
                )}
                {feed.video && (
                  <div>
                    <FeedVideoContent feed={feed} />
                  </div>
                )}
                {feed.referenceId && (
                  <div className={'bg-bg2 rounded-[6px] mt-3 p-5'}>
                    <FeedReferenceItem feedId={feed.referenceId} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={footer()}>
            {[
              {
                label: '转发',
                icon: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 18 18'
                    width='18'
                    height='18'
                    className={cn('mr-1')}
                  >
                    <path
                      d='M9.789075 2.2956175C8.97235 1.6308450000000003 7.74999 2.212005 7.74999 3.26506L7.74999 5.3915500000000005C6.642015000000001 5.5780325 5.3073725 6.040405 4.141735000000001 7.11143C2.809155 8.335825 1.751515 10.3041 1.45716 13.404099999999998C1.409905 13.9018 1.7595399999999999 14.22505 2.105415 14.317499999999999C2.442215 14.40755 2.8807175 14.314625 3.127745 13.92915C3.9664525 12.620249999999999 4.89282 11.894575 5.765827499999999 11.50585C6.4628049999999995 11.19545 7.14528 11.093125 7.74999 11.0959L7.74999 13.235025C7.74999 14.2881 8.97235 14.869250000000001 9.789075 14.2045L15.556199999999999 9.510425000000001C16.355075 8.860149999999999 16.355075 7.640124999999999 15.556199999999999 6.989840000000001L9.789075 2.2956175zM9.165099999999999 3.0768275000000003L14.895025 7.739050000000001C15.227975 7.980475 15.235775 8.468875 14.943874999999998 8.7142L9.17615 13.416800000000002C8.979474999999999 13.562024999999998 8.75 13.4269 8.75 13.227375000000002L8.75 10.638175C8.75 10.326975000000001 8.542125 10.134725 8.2544 10.1118C7.186765 10.02955 6.1563175 10.2037 5.150895 10.69295C4.14982 11.186925 3.2102250000000003 12.096525 2.573625 13.00995C2.54981 13.046975 2.52013 13.046025 2.5211725 12.986C2.8971525 10.0573 3.9373475 8.652125 4.807025 7.85305C5.87747 6.8694775 7.213197500000001 6.444867500000001 8.2272 6.33056C8.606525 6.287802500000001 8.74805 6.0849325 8.74805 5.7032275L8.74805 3.2615475C8.74805 3.0764875000000007 8.993175 2.9321925 9.165099999999999 3.0768275000000003z'
                      fill='currentColor'
                    ></path>
                  </svg>
                ),
                onClick: () => {
                  if (panelOpen !== 'transpont') setPanelOpen('transpont')
                  else setPanelOpen(null)
                },
              },
              {
                label: '评论',
                icon: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 18 18'
                    width='18'
                    height='18'
                    className={cn('mr-1')}
                  >
                    <path
                      d='M1.5625 7.875C1.5625 4.595807499999999 4.220807499999999 1.9375 7.5 1.9375L10.5 1.9375C13.779175 1.9375 16.4375 4.595807499999999 16.4375 7.875C16.4375 11.0504 13.944675 13.6435 10.809275 13.80405C10.097025 14.722974999999998 8.920875 15.880675 7.267095 16.331325C6.9735075 16.4113 6.704762499999999 16.286224999999998 6.55411 16.092325C6.40789 15.904149999999998 6.3561 15.634350000000001 6.4652449999999995 15.383025C6.72879 14.776249999999997 6.776465 14.221025000000001 6.7340175 13.761800000000001C3.8167675 13.387125 1.5625 10.894475 1.5625 7.875zM7.5 2.9375C4.773095 2.9375 2.5625 5.148095 2.5625 7.875C2.5625 10.502575 4.61524 12.651075000000002 7.2041924999999996 12.8038C7.4305875 12.817174999999999 7.619625000000001 12.981200000000001 7.664724999999999 13.203475C7.772575 13.734575000000001 7.8012 14.405425000000001 7.5884275 15.148399999999999C8.748325 14.6682 9.606 13.759825 10.151275 13.016475C10.24445 12.889475 10.392050000000001 12.8138 10.54955 12.812275C13.253575 12.785725 15.4375 10.58535 15.4375 7.875C15.4375 5.148095 13.226899999999999 2.9375 10.5 2.9375L7.5 2.9375z'
                      fill='currentColor'
                    ></path>
                  </svg>
                ),
                onClick: () => {
                  if (panelOpen !== 'comment') setPanelOpen('comment')
                  else setPanelOpen(null)
                },
                count: feed.comments,
              },
              {
                label: '点赞',
                icon: isLike ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 18 18'
                    width='18'
                    height='18'
                    className={cn('mr-1')}
                  >
                    <path
                      d='M15.238949999999999 5.8749875L11.728124999999999 5.8749875C11.903625 5.509125 12.108450000000001 5.0146725 12.179124999999999 4.54079C12.225925 4.227235 12.230549999999997 3.8411524999999997 12.192600000000002 3.4729099999999997C12.155475 3.1126975 12.072274999999998 2.715405 11.909324999999999 2.4065275C11.5572 1.73896 11.07925 1.2830650000000001 10.515075 1.1730275000000001C9.9175 1.056475 9.4 1.3591199999999999 9.086975 1.832795C8.821325 2.2348025 8.71795 2.5693425000000003 8.62185 2.8804925L8.619125 2.8893475C8.526275 3.1897624999999996 8.4337 3.488995 8.19635 3.9093850000000003C7.807925000000001 4.59742 7.489369999999999 4.956485000000001 7.062139999999999 5.331055C6.807695000000001 5.5541375 6.541364999999999 5.6883925 6.3125 5.760025L6.3125 15.85475C6.9202625 15.868200000000002 7.573125 15.876800000000003 8.25 15.876800000000003C10.00675 15.876800000000003 11.4894 15.819474999999999 12.466925 15.767950000000003C13.408750000000001 15.7183 14.305975 15.243900000000002 14.795475 14.385325C15.267499999999998 13.557499999999997 15.871775 12.304749999999999 16.235825000000002 10.807475C16.577575000000003 9.40205 16.719975 8.259725 16.7778 7.4839150000000005C16.846225 6.565215 16.10015 5.8749875 15.238949999999999 5.8749875zM5.3125 15.827525L5.3125 5.8749875L3.9767325000000002 5.8749875C2.8486374999999997 5.8749875 1.8491449999999998 6.6792625 1.7212225 7.843025000000001C1.63766 8.60325 1.5625 9.5917 1.5625 10.6893C1.5625 11.876325000000001 1.6504175 12.977975 1.7415649999999998 13.801975C1.864035 14.909174999999998 2.7766325 15.718875 3.8673275 15.770325C4.28143 15.789874999999999 4.769835 15.810149999999998 5.3125 15.827525z'
                      fill='currentColor'
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 18 18'
                    width='18'
                    height='18'
                    className={cn('mr-1')}
                  >
                    <path
                      d='M10.4511 2.2220125C10.218425 2.194885 10.002175 2.2953725 9.884175 2.433395C9.4264 2.9688525 9.321875 3.7501399999999996 8.978575 4.3581725C8.533574999999999 5.146395 8.1198 5.6213375 7.609775000000001 6.068507499999999C7.1751375 6.449565 6.738407499999999 6.697442499999999 6.3125 6.8050575L6.3125 14.854575C6.9198900000000005 14.868174999999999 7.572900000000001 14.876875 8.25 14.876875C9.936425 14.876875 11.367025 14.823325 12.33115 14.773699999999998C13.03235 14.737575 13.646025000000002 14.390075 13.966750000000001 13.81945C14.401900000000001 13.04535 14.9387 11.909650000000001 15.264174999999998 10.571200000000001C15.56665 9.327275 15.704699999999999 8.304325 15.766675 7.582224999999999C15.7988 7.208262500000001 15.50165 6.875019999999999 15.059999999999999 6.875019999999999L11.323274999999999 6.875019999999999C11.156575 6.875019999999999 11.000800000000002 6.791952499999999 10.907975 6.653499999999999C10.783725 6.468192500000001 10.82855 6.2670175 10.9037 6.07485C11.059 5.675084999999999 11.29355 4.9974475 11.382425000000001 4.4018275C11.470875000000001 3.80917 11.450999999999999 3.32219 11.212050000000001 2.86913C10.9571 2.3857825 10.66065 2.2464475 10.4511 2.2220125zM12.034300000000002 5.87502L15.059999999999999 5.87502C16.02035 5.87502 16.850875 6.64489 16.763 7.667825C16.697100000000002 8.435525 16.55155 9.5092 16.235825000000002 10.807500000000001C15.882625 12.259950000000002 15.3035 13.482225 14.838450000000002 14.309474999999999C14.32695 15.2194 13.377475 15.721150000000002 12.38255 15.772375C11.405125 15.822725 9.956949999999999 15.876875000000002 8.25 15.876875000000002C6.5961925 15.876875000000002 5.0846825 15.826025000000001 4.0136674999999995 15.77715C2.8370825 15.723474999999999 1.8519999999999999 14.850000000000001 1.725645 13.654824999999999C1.6404649999999998 12.849274999999999 1.5625 11.80725 1.5625 10.689375C1.5625 9.665175000000001 1.6279400000000002 8.736175 1.7045524999999997 7.998975C1.8351224999999998 6.7427075 2.9137075 5.87502 4.130655 5.87502L5.8125 5.87502C6.072015 5.87502 6.457235 5.7490675 6.9505175 5.316582499999999C7.377705000000001 4.942045 7.7193000000000005 4.5546075 8.107775 3.8665374999999997C8.492075 3.18585 8.605825 2.389785 9.124075 1.783595C9.452975 1.3988800000000001 9.99475 1.162025 10.5669 1.228745C11.16225 1.29816 11.717425 1.683875 12.09655 2.4025825000000003C12.478275 3.1262375000000002 12.474075 3.8618225 12.371500000000001 4.54938C12.302149999999997 5.0139949999999995 12.155425000000001 5.510059999999999 12.034300000000002 5.87502zM5.3125 14.82705L5.3125 6.875019999999999L4.130655 6.875019999999999C3.3792199999999997 6.875019999999999 2.77211 7.400795 2.6991975000000004 8.10235C2.6253525 8.812875 2.5625 9.70665 2.5625 10.689375C2.5625 11.762875 2.6374975 12.768475 2.7200975 13.549700000000001C2.7919925 14.229675 3.3521950000000005 14.74595 4.05924 14.778224999999999C4.4278775 14.795 4.849985 14.812050000000001 5.3125 14.82705z'
                      fill='currentColor'
                    ></path>
                  </svg>
                ),
                onClick: async () => {
                  if (isLike) {
                    await unlike()
                  } else {
                    await like()
                  }
                },
                count: feed.likes,
              },
            ].map((item) => (
              <div key={item.label}>
                <div
                  onClick={item.onClick}
                  className={cn(
                    'items-center flex text-text2 cursor-pointer hover:text-brand_blue text-[13px] h-full relative select-none w-[104px]',
                    item.label === '点赞' && isLike && 'text-brand_blue'
                  )}
                >
                  {item.icon}
                  {item.count || item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {panelOpen && (
          <div className={panel()}>
            {panelOpen === 'transpont' && (
              <div className={'px-6 w-full text-xs'}>
                <FeedTranspontContent feedId={feed.id} />
              </div>
            )}
            {panelOpen === 'comment' && (
              <div className={'px-6'}>
                <CommentWrapper user={feed.user} isLink feedId={feed.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedListItem
