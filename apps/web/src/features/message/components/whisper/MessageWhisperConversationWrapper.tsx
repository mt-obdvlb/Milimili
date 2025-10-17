'use client'

import { useMessageConversationDetail, useUserGetById } from '@/features'
import { useUserStore } from '@/stores'
import MessageWhisperSend from '@/features/message/components/whisper/MessageWhisperSend'
import { formatWatchAt } from '@/utils'
import MessageWhisperConversationItem from '@/features/message/components/whisper/MessageWhisperConversationItem'
import { Fragment } from 'react'

const MessageWhisperConversationWrapper = ({ userId }: { userId: string }) => {
  const { conversation } = useMessageConversationDetail(userId)
  const user = useUserStore((state) => state.user)
  const { user: toUser } = useUserGetById(userId)
  if (!user || !toUser || !conversation) return null
  return (
    <div className={'size-full bg-bg2 relative flex flex-col rounded-r-[4px]'}>
      <div
        className={
          'w-full h-9 shrink-0 border-b border-b-line_regular relative flex items-center justify-center z-1'
        }
      >
        <div className={'text-sm text-text1'}>{toUser.name}</div>
      </div>
      <div className={'w-full flex-1 overflow-hidden'}>
        <div className={'bg-bg2 flex flex-col-reverse size-full overflow-auto relative'}>
          <div className={'w-full relative bg-bg2 flex flex-col-reverse mb-auto'}>
            {conversation.map(({ conversations, date }) => (
              <Fragment key={date}>
                {conversations.map((message, index) => (
                  <div key={message.id} className={'px-4 pb-4 relative w-full'}>
                    {index === conversations.length - 1 && (
                      <div className={'text-text2 py-4 text-xs text-center'}>
                        {formatWatchAt(date)}
                      </div>
                    )}
                    <MessageWhisperConversationItem
                      isMe={message.user.id === user.id}
                      message={message}
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className={'w-full shrink-0 h-[138px] pt-6 border-t border-t-line_regular'}>
        <MessageWhisperSend userId={toUser.id} />
      </div>
    </div>
  )
}

export default MessageWhisperConversationWrapper
