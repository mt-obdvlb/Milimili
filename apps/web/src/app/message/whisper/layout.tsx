import { ReactNode } from 'react'
import MessageCommonHeader from '@/features/message/components/common/MessageCommonHeader'
import MessageWhisperWrapper from '@/features/message/components/whisper/MessageWhisperWrapper'

const MessageWhisperLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'h-full'}>
      <MessageCommonHeader title={'我的消息'} />
      <div className={'relative h-[calc(100%-42px)] p-2.5 pr-0'}>
        <div className={'size-full pr-2.5'}>
          <div
            className={'size-full rounded-[4px] bg-bg1 shadow-[0_2px_4px_0_rgba(121,146,185,.54)]'}
          >
            <MessageWhisperWrapper>{children}</MessageWhisperWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageWhisperLayout
