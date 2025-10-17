'use client'

import { useMessageContext } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import MessageAtListItem from '@/features/message/components/at/MessageAtListItem'

const MessageAtList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)

  return (
    <div className={'h-full overflow-y-auto'}>
      {messageList.map((item, index) => (
        <MessageAtListItem
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

export default MessageAtList
