import { ReactNode } from 'react'

const MessageCommonItemTitle = ({ children }: { children: ReactNode }) => {
  return <div className={'flex text-sm leading-[15px]'}>{children}</div>
}

export default MessageCommonItemTitle
