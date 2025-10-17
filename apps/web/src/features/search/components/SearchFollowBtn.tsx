'use client'

import { Button } from '@/components'
import { cn, toast } from '@/lib'
import { useFollow, useFollowGet } from '@/features/follow/api'
import { useUiStore, useUserStore } from '@/stores'

const SearchFollowBtn = ({
  followingId,
  className,
}: {
  followingId: string
  className?: string
}) => {
  const { isFollowing } = useFollowGet(followingId)
  const { follow, unfollow } = useFollow(followingId)
  const user = useUserStore((state) => state.user)
  const setLoginModel = useUiStore((state) => state.setLoginModel)

  const handleFollow = async () => {
    const { code } = await follow({ followingId })
    if (!code) {
      toast('关注成功')
    }
  }

  const handleUnFollow = async () => {
    const { code } = await unfollow({ followingId })
    if (!code) {
      toast('取消关注成功')
    }
  }

  const handleClick = async () => {
    if (!user) {
      setLoginModel(true)
      return
    }
    if (isFollowing) {
      await handleUnFollow()
    } else {
      await handleFollow()
    }
  }

  if (isFollowing) {
    return (
      <Button
        onClick={handleClick}
        className={cn(
          'text-text2 bg-graph_bg_regular hover:bg-graph_bg_thick h-8 w-[96px] min-w-25 cursor-pointer rounded-[8px] border-none p-0 text-[16px] leading-[1] whitespace-nowrap transition-all duration-200 select-none',
          className
        )}
      >
        已关注
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        'bg-brand_blue border-brand_blue h-8 w-[96px] min-w-25 cursor-pointer rounded-[8px] border p-0 text-[16px] leading-[1] whitespace-nowrap text-white transition-all duration-200 select-none hover:border-[#40C5F1] hover:bg-[#40C5F1]',
        className
      )}
    >
      + 关注
    </Button>
  )
}

export default SearchFollowBtn
