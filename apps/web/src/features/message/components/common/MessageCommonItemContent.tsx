import { ReactNode } from 'react'

const MessageCommonItemContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'w-[calc(100%-76px)] py-6 pr-4 border-b border-b-line_regular'}>
      <div className={'relative pr-[76px]'}>{children}</div>
    </div>
  )
}

export default MessageCommonItemContent
