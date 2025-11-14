import { Button, UserHoverAvatar } from '@/components'
import UserAvatar from '@/components/ui/UserAvatar'
import Link from 'next/link'
import FollowBtn from '@/components/ui/follow-btn'
import { openNewTab } from '@/utils'
import { useMessageConversation } from '@/features'
import { Mail } from 'lucide-react'

const VideoUserContainer = ({ user }: { user: { id: string; name: string; avatar: string } }) => {
  const { createConversation } = useMessageConversation()

  return (
    <div className={'pointer-events-auto h-[104px] flex items-center '}>
      <div className={'size-20 flex justify-center items-center shrink-0'}>
        <UserHoverAvatar user={user}>
          <Link
            target={'_blank'}
            href={`/apps/web/src/app/(with-auth)/space/${user.id}`}
            className={'size-12 rounded-full overflow-hidden cursor-pointer'}
          >
            <UserAvatar avatar={user.avatar} h={48} w={48} />
          </Link>
        </UserHoverAvatar>
      </div>
      <div className={'ml-3 flex-1 overflow-auto'}>
        <div className={'mb-[5px]'}>
          <div className={'flex items-center '}>
            <UserHoverAvatar user={user}>
              <Link
                href={`/apps/web/src/app/(with-auth)/space/${user.id}`}
                className={
                  'text-text1 text-[15px] font-medium relative whitespace-nowrap text-ellipsis overflow-hidden mr-3 max-w-[calc(100%-12px-56px)]'
                }
                target={'_blank'}
              >
                {user.name}
              </Link>
            </UserHoverAvatar>
            <Button
              className={
                'text-text2 text-[13px] shrink-0 flex items-center justify-center transition-colors duration-300 cursor-pointer hover:text-brand_blue'
              }
              onClick={async (e) => {
                e.stopPropagation()
                e.preventDefault()
                const { code } = await createConversation(user.id)
                if (code) return
                openNewTab(`/message/whisper/${user.id}`)
              }}
            >
              <Mail className={'inline-block size-[13px] mr-1 text-[13px]'} />
              发消息
            </Button>
          </div>
        </div>
        <div className={'clear-both flex mt-[5px] whitespace-nowrap items-center justify-start'}>
          <FollowBtn followingId={user.id} className={'w-[137px] m-0'} />
        </div>
      </div>
    </div>
  )
}

export default VideoUserContainer
