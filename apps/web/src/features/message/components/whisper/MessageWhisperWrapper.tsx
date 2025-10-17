import { ReactNode } from 'react'
import MessageWhisperList from '@/features/message/components/whisper/MessageWhisperList'

const MessageWhisperWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={
        'shadow-[0_2px_4px_rgba(121,146,185,.54118)] relative flex rounded-[4px] bg-bg1 size-full'
      }
    >
      <div className={'h-full w-60 border-r border-r-line_regular'}>
        <div
          className={
            'px-6 h-9 border-b border-b-line_regular select-none flex items-center text-xs text-text2'
          }
        >
          <div className={'leading-[1]'}>最近消息</div>
        </div>
        <div
          className={
            'w-full h-[calc(100%-36px)] relative overflow-x-hidden rounded-bl-[4px] overflow-y-auto'
          }
        >
          <MessageWhisperList />
        </div>
      </div>
      <div className={'w-[calc(100%-240px)] h-full relative'}>{children}</div>
    </div>
  )
}

export default MessageWhisperWrapper
