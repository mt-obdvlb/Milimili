'use client'

import { useMessageContext } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import MessageSystemListItem from '@/features/message/components/system/MessageSystemListItem'

const MessageSystemList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)
  return (
    <div>
      {messageList.map((item, index) => (
        <MessageSystemListItem
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

export default MessageSystemList
