'use client'

import Image from 'next/image'
import { cloneElement, ReactElement, ReactNode } from 'react'
import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@/components'
import Link from 'next/link'
import { useFollow, useFollowGet, useUserGetByName } from '@/features'
import { openNewTab } from '@/utils'
import { cn, toast } from '@/lib'

const UserAvatar = ({ h, w, avatar }: { avatar: string; h: number; w: number }) => {
  return (
    <div
      style={{
        height: h,
        width: w,
      }}
      className={'rounded-full overflow-hidden'}
    >
      <Image src={avatar} alt={'avatar'} height={h} width={w} />
    </div>
  )
}

export const UserHoverAvatar = ({
  children,
  user: { avatar, name, id },
}: {
  children: ReactNode
  user: { avatar: string; name: string; id: string }
}) => {
  const { data } = useUserGetByName(name)
  const { follow, unfollow } = useFollow(id)
  const { isFollowing } = useFollowGet(id)

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>{cloneElement(children as ReactElement)}</HoverCardTrigger>
      <HoverCardContent
        className={
          'z-1018 bg-bg1_float w-[366px] rounded-[8px] text-text3 text-xs antialiased shadow-[rgba(0,0,0,.1)_0px_0px_30px_2px]'
        }
      >
        <div
          className={
            "bg-[url('/images/user-profile-bg.avif')] bg-center bg-no-repeat bg-cover rounded-[8px] rounded-b-[0px] h-[85px] left-0 top-0 w-[366px] absolute overflow-hidden"
          }
        ></div>
        <Link className={'size-12 absolute top-[95px] left-2.5'} href={`/space/${id}`}>
          {<UserAvatar avatar={avatar} h={48} w={48} />}
        </Link>
        <div className={'pt-[97px] pr-5 pb-4 pl-[70px]'}>
          <div className={'flex items-center h-[21px] pb-2.5 box-content '}>
            <Link
              target={'_blank'}
              href={`/space/${id}`}
              className={'text-text1 font-bold text-sm cursor-pointer'}
            >
              {name}
            </Link>
          </div>

          <div>
            <div className={'flex items-center pb-2.5 text-xs '}>
              <Link target={'_blank'} className={'text-text3 pr-[18px] '} href={`/space/${id}`}>
                <span className={'text-text1 inline-block mr-[3px]'}>{data?.followers}</span>
                粉丝
              </Link>
              <Link target={'_blank'} href={`/space/${id}`} className={'text-text3 pr-[18px] '}>
                <span className={'text-text1 inline-block mr-[3px]'}>{data?.followings}</span>
                关注
              </Link>
            </div>
            <div className={''}>你所热爱的，就是你的生活</div>
          </div>

          <div className={'flex items-center mt-4 '}>
            <Button
              onClick={async () => {
                if (isFollowing) {
                  const { code } = await unfollow({ followingId: id })
                  if (code) return
                  toast('已取关')
                } else {
                  const { code } = await follow({ followingId: id })
                  if (code) return
                  toast('已关注')
                }
              }}
              className={cn(
                'items-center rounded-[3px] border hover:bg-[#00b8f6] hover:border-[#00b8f6] cursor-pointer flex text-sm h-[30px] justify-center transition duration-300 w-25 ml-2 text-white border-brand_blue bg-brand_blue',
                isFollowing &&
                  'bg-graph_bg_thick hover:bg-graph_bg_regular text-text3 border-graph_bg_thick'
              )}
            >
              <div className={'inline-flex items-center   mr-[3px]'}>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                  <path
                    d='M7.9986999999999995 2.333333333333333C8.274833333333333 2.333333333333333 8.4987 2.557193333333333 8.4987 2.833333333333333L8.4987 7.499866666666667L13.166666666666666 7.499866666666667C13.4428 7.499866666666667 13.666666666666666 7.723699999999999 13.666666666666666 7.999866666666667C13.666666666666666 8.276 13.4428 8.499866666666666 13.166666666666666 8.499866666666666L8.4987 8.499866666666666L8.4987 13.166666666666666C8.4987 13.4428 8.274833333333333 13.666666666666666 7.9986999999999995 13.666666666666666C7.722533333333333 13.666666666666666 7.4986999999999995 13.4428 7.4986999999999995 13.166666666666666L7.4986999999999995 8.499866666666666L2.833333333333333 8.499866666666666C2.557193333333333 8.499866666666666 2.333333333333333 8.276 2.333333333333333 7.999866666666667C2.333333333333333 7.723699999999999 2.557193333333333 7.499866666666667 2.833333333333333 7.499866666666667L7.4986999999999995 7.499866666666667L7.4986999999999995 2.833333333333333C7.4986999999999995 2.557193333333333 7.722533333333333 2.333333333333333 7.9986999999999995 2.333333333333333z'
                    fill='currentColor'
                  ></path>
                </svg>
                <span>{isFollowing ? '已关注' : '关注'}</span>
              </div>
            </Button>
            <Button
              onClick={() => openNewTab(`/message/whisper/${id}`)}
              className={
                'items-center rounded-[3px] border cursor-pointer flex text-sm h-[30px] justify-center transition duration-300 w-25 ml-2 text-text2 border-text3 bg-transparent'
              }
            >
              发消息
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserAvatar
