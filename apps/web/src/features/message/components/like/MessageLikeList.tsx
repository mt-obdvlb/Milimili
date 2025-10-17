'use client'

import { useMessageContext } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import MessageLikeListItem from '@/features/message/components/like/MessageLikeListItem'

const MessageLikeList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)

  return (
    <div className={'h-full overflow-y-auto'}>
      {messageList.map((item, index) => (
        <MessageLikeListItem
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

export default MessageLikeList
