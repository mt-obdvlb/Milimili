'use client'

import { useMessageStatistics } from '@/features'
import { MessageType } from '@mtobdvlb/shared-types'
import MessageLayoutListItem from '@/features/message/components/layout/MessageLayoutListItem'

const messageList: { type: MessageType; label: string }[] = [
  {
    type: 'whisper',
    label: '我的消息',
  },
  {
    type: 'reply',
    label: '回复我的',
  },
  {
    type: 'at',
    label: '@ 我的',
  },
  {
    type: 'like',
    label: '收到的赞',
  },
  {
    type: 'system',
    label: '系统通知',
  },
]

const MessageLayoutList = () => {
  const { messageStatistics } = useMessageStatistics()

  return (
    <ul className={'m-0 pl-5'}>
      {messageList?.map((item) => (
        <MessageLayoutListItem
          type={item.type}
          statistic={messageStatistics?.find((i) => i.type === item.type)?.count ?? 0}
          key={item.type}
          label={item.label}
        />
      ))}
    </ul>
  )
}

export default MessageLayoutList
