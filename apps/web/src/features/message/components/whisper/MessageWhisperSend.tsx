'use client'

import { AtTextareaRef, Button } from '@/components'
import { cn, toast } from '@/lib'
import AtTextareaPlaceholder from '@/components/layout/at/AtTextareaPlaceholder'
import { useRef, useState } from 'react'
import AtTextarea from '@/components/layout/at/AtTextarea'
import { useMessageSend } from '@/features'

const MessageWhisperSend = ({ userId }: { userId: string }) => {
  const [textCount, setTextCount] = useState(0)
  const atTextRef = useRef<AtTextareaRef>(null)
  const { sendMessage } = useMessageSend(userId)
  const handleClick = async () => {
    const text = atTextRef.current?.getEditor()?.getText()
    if (!text) {
      toast('不可发送空白消息')
      return
    }
    const { code } = await sendMessage({ content: text, toId: userId })
    if (code) return
    atTextRef.current?.reset()
  }

  return (
    <div className={'size-full'}>
      <div className={'w-full h-[calc(100%-46px)] text-text1'}>
        <div className={'size-full relative'}>
          <AtTextareaPlaceholder
            className={'text-text3 leading-5 text-sm left-2 '}
            atTextCount={textCount}
          >
            请输入消息内容
          </AtTextareaPlaceholder>
          <AtTextarea
            pClassName={' text-sm leading-5'}
            onUpdate={(count) => setTextCount(count)}
            ref={atTextRef}
            className={'px-2  text-sm leading-5'}
          />
        </div>
      </div>
      <div className={'w-full h-[46px] px-4 flex items-center justify-end '}>
        <div className={'text-text3 text-xs mr-3'}>{`${textCount}/500`}</div>
        <Button
          onClick={handleClick}
          disabled={!textCount}
          className={cn(
            'transition duration-200 flex items-center justify-center border w-22 text-[13px] h-[30px] leading-[30px] rounded-[4px]',
            !textCount
              ? 'bg-bg1  border-line_regular text-text1  '
              : 'text-white border-brand_blue bg-brand_blue'
          )}
        >
          发送
        </Button>
      </div>
    </div>
  )
}

export default MessageWhisperSend
