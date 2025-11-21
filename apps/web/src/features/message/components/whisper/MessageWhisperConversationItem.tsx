import { MessageGetConversationItem } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import CoverImage from '@/components/ui/CoverImage'
import Link from 'next/link'

const MessageWhisperConversationItem = ({
  message,
  isMe,
}: {
  isMe: boolean
  message: MessageGetConversationItem
}) => {
  return (
    <div className={cn('flex w-full', isMe && 'flex-row-reverse')}>
      <Link
        className={cn(
          'cursor-pointer shrink-0 mr-2.5 size-[30px] rounded-full overflow-hidden block',
          isMe && 'ml-2.5 mr-0'
        )}
        href={`/space/${message.user.id}`}
        target={'_blank'}
      >
        <CoverImage src={message.user.avatar} alt={message.user.name} width={30} height={30} />
      </Link>
      <div className={'w-full'}>
        <div className={cn('w-fit flex', isMe && 'flex-row-reverse ml-auto')}>
          <div
            className={cn(
              'py-2 px-4 rounded-[16px]  overflow-hidden  bg-bg1 w-fit text-text1 mr-2.5 ml-0 ',
              isMe ? 'bg-brand_blue text-white mr-0 ml-2.5 rounded-tr-none' : 'rounded-tl-none'
            )}
          >
            <div className={'break-words  leading-[1.5] text-sm whitespace-pre-wrap'}>
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageWhisperConversationItem
