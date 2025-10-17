import { MessageGetConversationItem } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import Image from 'next/image'

const MessageWhisperConversationItem = ({
  message,
  isMe,
}: {
  isMe: boolean
  message: MessageGetConversationItem
}) => {
  return (
    <div className={cn('flex w-full', isMe && 'flex-row-reverse')}>
      <div
        className={cn(
          'cursor-pointer shrink-0 mr-2.5 size-[30px] rounded-full overflow-hidden',
          isMe && 'ml-2.5 mr-0'
        )}
      >
        <Image src={message.user.avatar} alt={message.user.name} width={30} height={30} />
      </div>
      <div className={'w-full'}>
        <div className={cn('w-fit flex', isMe && 'flex-row-reverse ml-auto')}>
          <div
            className={cn(
              'py-2 px-4 rounded-x-[16px] rounded-b-[16px] overflow-hidden bg-bg1 w-fit text-text1 mr-2.5 ml-0 ',
              isMe && 'bg-brand_blue text-white mr-0 ml-2.5 rounded-[16px_0_16px_16px]'
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
