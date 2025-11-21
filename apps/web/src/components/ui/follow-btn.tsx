import { cn, toast } from '@/lib'
import { Button } from '@/components'
import { useFollow, useFollowGet } from '@/features'

const FollowBtn = ({ followingId, className }: { className?: string; followingId: string }) => {
  const { follow, unfollow } = useFollow(followingId)
  const { isFollowing } = useFollowGet(followingId)
  return (
    <Button
      onClick={async () => {
        if (isFollowing) {
          const { code } = await unfollow({ followingId: followingId })
          if (code) return
          toast('已取关')
        } else {
          const { code } = await follow({ followingId: followingId })
          if (code) return
          toast('已关注')
        }
      }}
      className={cn(
        'items-center rounded-[3px] border  cursor-pointer flex text-sm h-[30px] justify-center transition duration-300 w-25 ml-2 text-white border-brand_blue bg-brand_blue',
        isFollowing
          ? 'bg-graph_bg_thick hover:bg-graph_bg_regular text-text3 border-graph_bg_thick'
          : 'hover:bg-[#00b8f6] hover:border-[#00b8f6]',
        className
      )}
    >
      <div className={'inline-flex items-center   mr-[3px]'}>
        {!isFollowing && (
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
            <path
              d='M7.9986999999999995 2.333333333333333C8.274833333333333 2.333333333333333 8.4987 2.557193333333333 8.4987 2.833333333333333L8.4987 7.499866666666667L13.166666666666666 7.499866666666667C13.4428 7.499866666666667 13.666666666666666 7.723699999999999 13.666666666666666 7.999866666666667C13.666666666666666 8.276 13.4428 8.499866666666666 13.166666666666666 8.499866666666666L8.4987 8.499866666666666L8.4987 13.166666666666666C8.4987 13.4428 8.274833333333333 13.666666666666666 7.9986999999999995 13.666666666666666C7.722533333333333 13.666666666666666 7.4986999999999995 13.4428 7.4986999999999995 13.166666666666666L7.4986999999999995 8.499866666666666L2.833333333333333 8.499866666666666C2.557193333333333 8.499866666666666 2.333333333333333 8.276 2.333333333333333 7.999866666666667C2.333333333333333 7.723699999999999 2.557193333333333 7.499866666666667 2.833333333333333 7.499866666666667L7.4986999999999995 7.499866666666667L7.4986999999999995 2.833333333333333C7.4986999999999995 2.557193333333333 7.722533333333333 2.333333333333333 7.9986999999999995 2.333333333333333z'
              fill='currentColor'
            ></path>
          </svg>
        )}
        <span>{isFollowing ? '已关注' : '关注'}</span>
      </div>
    </Button>
  )
}

export default FollowBtn
