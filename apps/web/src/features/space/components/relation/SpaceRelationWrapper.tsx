'use client'
import { useFollowList } from '@/features'
import { useState } from 'react'
import SpaceCommonPagination from '@/features/space/components/common/SpaceCommonPagination'
import { UserHoverAvatar } from '@/components'
import UserAvatar from '@/components/ui/UserAvatar'
import Link from 'next/link'
import FollowBtn from '@/components/ui/follow-btn'

const SapceRelationWrapper = ({
  title,
  userId,
  type,
}: {
  title: string
  userId: string
  type: 'following' | 'follower'
}) => {
  const [page, setPage] = useState(1)
  const { total, followList } = useFollowList({ userId, page, pageSize: 50, type })

  return (
    <div className={'w-[1345px] pl-[18px] mt-[30px] pb-10'}>
      <div className={'relative font-semibold mb-[30px] leading-[1.5] text-[24px]'}>{title}</div>
      <div className={'grid grid-cols-3 gap-x-[38px] gap-y-5 mt-[30px'}>
        {followList.map((item) => (
          <div
            className={'flex h-[118px] items-center justify-between pt-4 pb-4.5'}
            key={item.user.id}
          >
            <UserHoverAvatar user={item.user}>
              <Link className={'size-20 cursor-pointer'} href={`/space/${item.user.id}`}>
                <UserAvatar avatar={item.user.avatar} h={80} w={80} />
              </Link>
            </UserHoverAvatar>
            <div className={'ml-4 flex flex-col flex-1'}>
              <div
                className={
                  'text-text1 text-[16px] font-medium transition-colors duration-200 overflow-hidden line-clamp-1 text-ellipsis'
                }
              >
                {item.user.name}
              </div>
            </div>
            <div className={'w-full items-center flex'}>
              <FollowBtn
                followingId={item.user.id}
                className={'w-[96px] h-[35px] font-bold text-sm rounded-[6px]'}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={'py-15 mx-auto w-fit'}>
        <SpaceCommonPagination page={page} setPage={setPage} total={total} />
      </div>
    </div>
  )
}

export default SapceRelationWrapper
