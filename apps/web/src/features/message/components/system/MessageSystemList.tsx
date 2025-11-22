'use client'

import { useMessageContext } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import MessageSystemListItem from '@/features/message/components/system/MessageSystemListItem'

const MessageSystemList = () => {
  const { messageList, fetchNextPage } = useMessageContext()
  const { ref } = useInfiniteScroll(fetchNextPage)
  if (messageList.length === 0)
    return <div className={'flex justify-center items-center py-50 text-text3'}>暂无消息</div>
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
