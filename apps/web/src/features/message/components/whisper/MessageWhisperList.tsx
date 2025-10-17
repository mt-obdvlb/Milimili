'use client'

import { useMessageContext } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import MessageWhisperListItem from '@/features/message/components/whisper/MessageWhisperListItem'

const MessageWhipserList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)

  return (
    <div className={'size-full'}>
      {messageList.map((item, index) => (
        <MessageWhisperListItem
          key={item.id}
          item={item}
          total={messageList.length}
          index={index}
          ref={ref}
        />
      ))}
    </div>
  )
}

export default MessageWhipserList
