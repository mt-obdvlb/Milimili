'use client'

import MessageLayoutList from '@/features/message/components/layout/MessageLayoutList'
import { ReactNode, useEffect, useState } from 'react'
import { useMessageList, useMessageRead } from '@/features'
import { MessageType } from '@mtobdvlb/shared-types'
import { usePathname } from 'next/navigation'
import { MessageProvider } from '@/features/message/useMessageContext'

const MessageLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<MessageType>('whisper')
  const { readMessage } = useMessageRead()

  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // 假设路径类似 /message/whisper
    const segments = pathname.split('/').filter(Boolean)
    const last = segments[1] as MessageType
    const userId = segments[2]

    void readMessage({
      type: last,
      userId,
    })

    if (['reply', 'at', 'like', 'system', 'whisper'].includes(last)) {
      setType(last)
    } else {
      setType('whisper') // 默认值
    }
  }, [pathname, readMessage])
  const { messageList, fetchNextPage } = useMessageList(type)

  return (
    <div
      className={
        'mx-auto flex h-[calc(100vh-64px)] w-[980px] max-w-[1143px] flex-row items-stretch'
      }
    >
      <aside className={'h-full w-[140px] shrink-0 bg-[rgba(var(--bg1_rgb),.8)]'}>
        <div className={'w-full font-bold'}>
          <div className={'text-text1 flex h-[62px] w-full items-center justify-center text-sm'}>
            <div className={'text-text1 mr-2.5 flex items-center'}>
              <svg viewBox='0 0 16 12' className={'size-[14px]'}>
                <path
                  d='M15.6386295,4.17014918 C16.454219,4.39885202 15.6343208,5.07824066 15.6343208,5.07824066 L12.8711365,7.09359077 L4.27181047,2.64580413 C4.27181047,2.64580413 10.0809335,6.55511522 11.8533103,7.76666817 L5.86501964,11.7253113 C4.91770244,12.2710516 4.67094307,11.8350769 4.67094307,11.8350769 L4.25489009,10.97071 L0.0325132718,0.704758608 C-0.125784343,0.348173789 0.320384239,-0.0596727945 0.798575886,0.00727624935 L15.6386295,4.17014918 Z M10.2454612,9.59252937 C10.230576,9.58092963 10.2174075,9.56728156 10.2063473,9.55199119 C10.14161,9.46249359 10.1616822,9.3374615 10.2511798,9.27272421 L11.7512731,8.18764499 C11.7871922,8.16166319 11.8307257,8.14835156 11.875033,8.14980177 C11.9854308,8.15341518 12.0719967,8.24583954 12.0683833,8.35623737 L11.9964408,10.5542479 C11.995057,10.5965255 11.9803043,10.6372757 11.9543032,10.6706411 C11.8864076,10.757767 11.7607379,10.7733563 11.673612,10.7054607 L10.2454612,9.59252937 Z'
                  id='纸飞机'
                  transform='translate(8.000000, 6.000000) scale(-1, 1) translate(-8.000000, -6.000000)'
                  fill='currentColor'
                ></path>
              </svg>
            </div>
            <span>消息中心</span>
          </div>
          <MessageLayoutList />
        </div>
      </aside>
      <MessageProvider messageList={messageList} fetchNextPage={fetchNextPage}>
        <main className={'pt-2.5 w-[calc(100%-140px)] bg-[rgba(var(--bg1_rgb),.5)]'}>
          {children}
        </main>
      </MessageProvider>
    </div>
  )
}

export default MessageLayoutWrapper
