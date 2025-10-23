'use client'

import Image from 'next/image'
import { cloneElement, ReactElement, ReactNode } from 'react'
import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@/components'
import Link from 'next/link'
import { useMessageConversation, useUserGetByName } from '@/features'
import { openNewTab } from '@/utils'
import FollowBtn from '@/components/ui/follow-btn'

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

  const { createConversation } = useMessageConversation()

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
            <FollowBtn followingId={id} />
            <Button
              onClick={async (e) => {
                e.stopPropagation()
                e.preventDefault()
                const { code } = await createConversation(id)
                if (code) return
                openNewTab(`/message/whisper/${id}`)
              }}
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
