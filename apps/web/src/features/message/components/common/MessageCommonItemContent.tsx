import { ReactNode } from 'react'
import { MessageListItem } from '@mtobdvlb/shared-types'
import { openNewTab } from '@/utils'
import { toast } from '@/lib'

const MessageCommonItemContent = ({
  children,
  item,
}: {
  children: ReactNode
  item: MessageListItem
}) => {
  return (
    <div className={'w-[calc(100%-76px)] py-6 pr-4 border-b border-b-line_regular'}>
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (
            item.myContent === '[动态已删除]' ||
            item.myContent === '[视频已删除]' ||
            item.myContent === '[评论已删除]'
          ) {
            toast(item.myContent.slice(1, -1))
            return
          }
          if (item.sourceType === 'video') {
            openNewTab(`/video/${item.sourceId}`)
          } else if (item.sourceType === 'feed') {
            openNewTab(`/feed/${item.sourceId}`)
          }
        }}
        className={'relative pr-[76px]'}
      >
        {children}
      </div>
    </div>
  )
}

export default MessageCommonItemContent
