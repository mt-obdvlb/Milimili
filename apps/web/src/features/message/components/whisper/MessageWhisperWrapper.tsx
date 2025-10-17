import { ReactNode } from 'react'

const MessageWhisperWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={
        'shadow-[0_2px_4px_rgba(121,146,185,.54118)] relative flex rounded-[4px] bg-bg1 size-full'
      }
    >
      <div className={'h-full w-60 border-r border-r-line_regular'}></div>
      <div className={'w-[calc(100%-240px)] h-full relative'}>{children}</div>
    </div>
  )
}

export default MessageWhisperWrapper
