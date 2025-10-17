'use client'

import { MessageListItem } from '@mtobdvlb/shared-types'
import { Ref, useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib'
import { usePathname, useRouter } from 'next/navigation'
import { useMessageConversation } from '@/features'

const MessageWhisperListItem = ({
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
  const pathname = usePathname()
  const router = useRouter()
  const isActive = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    return lastSegment === item.fromUser.id
  }, [pathname, item])
  const { deleteConversation } = useMessageConversation()

  return (
    <div
      onClick={() => {
        router.push(`/message/whisper/${item.fromUser.id}`)
      }}
      className={cn(
        'w-full group hover:bg-bg3 py-[19px] pr-3 pl-6 relative flex cursor-pointer ',
        isActive && 'bg-bg3'
      )}
      ref={index === total - 1 ? ref : null}
    >
      <div className={'relative size-10 mr-2 shrink-0'}>
        <div className={'size-full rounded-full overflow-hidden'}>
          <Image src={item.fromUser.avatar} alt={item.fromUser.name} width={40} height={40} />
        </div>
      </div>
      <div className={'flex-1 overflow-hidden flex flex-col justify-center'}>
        <div className={'flex items-center'}>
          <div
            className={
              'text-sm leading-[22px] h-[22px] text-text1 w-[126px] overflow-hidden text-ellipsis whitespace-nowrap'
            }
          >
            {item.fromUser.name}
          </div>
        </div>
        <div className={'flex items-center text-xs leading-4.5'}>
          <div className={'flex-1 overflow-hidden text-text3 text-ellipsis whitespace-nowrap'}>
            {item.content}
          </div>
        </div>
      </div>
      <div
        className={
          'absolute inset-y-0 left-0 flex justify-center items-center w-6 opacity-0 transition-all duration-300 -translate-x-full group-hover:translate-x-0 group-hover:opacity-100'
        }
      >
        <div
          onClick={async (e) => {
            e.stopPropagation()
            await deleteConversation(item.id)
            router.push('/message/whisper')
          }}
          className={'size-4 cursor-pointer'}
        >
          <i
            className={'sic-BDC-xmark_close_line text-[16px] font-normal leading-[1] text-text2'}
          ></i>
        </div>
      </div>
    </div>
  )
}

export default MessageWhisperListItem
