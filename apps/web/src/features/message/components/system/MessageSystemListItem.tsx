import { MessageListItem } from '@mtobdvlb/shared-types'
import { Ref } from 'react'
import dayjs from 'dayjs'

const MessageSystemListItem = ({
  ref,
  item,
  index,
  total,
}: {
  item: MessageListItem
  index: number
  ref: Ref<HTMLDivElement>
  total: number
}) => {
  return (
    <div className={'mb-4'} ref={index === total - 1 ? ref : null}>
      <div className={'py-6 px-4 rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)]'}>
        <div className={'text-xs leading-6'}>
          <span className={'text-text1 font-bold'}>{item.fromUser.name}</span>
          <span className={'text-text3 mx-2.5'}>
            {dayjs(item.createdAt).format('YYYY年M月D日 HH:mm')}
          </span>
        </div>
        <div className={''}>
          <div className={'leading-6 text-xs text-text2 whitespace-pre-line break-all'}>
            {item.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageSystemListItem
