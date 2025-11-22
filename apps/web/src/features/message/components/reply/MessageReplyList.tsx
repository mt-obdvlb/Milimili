'use client'

import { useMessageContext } from '@/features/message/useMessageContext'
import { useInfiniteScroll } from '@/hooks'
import MessageReplyListItem from '@/features/message/components/reply/MessageReplyListItem'

const MessageReplyList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)
  if (messageList.length === 0)
    return <div className={'flex justify-center items-center py-50 text-text3'}>暂无消息</div>
  return (
    <div className={'h-full overflow-y-auto'}>
      {messageList.map((item, index) => (
        <MessageReplyListItem
          item={item}
          total={messageList.length}
          index={index}
          key={item.id}
          ref={ref}
        />
      ))}
    </div>
  )
}

export default MessageReplyList
