import { ReactNode } from 'react'
import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import MessageLayoutWrapper from '@/features/message/components/layout/MessageLayoutWrapper'

const MessageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper />
      </header>
      <div className={'text-text1 relative'}>
        <div
          className={'pointer-events-none fixed top-0 left-0 -z-1 h-screen w-full bg-[#d6ebea]'}
        ></div>
        <div
          className={
            "pointer-events-none fixed top-0 left-0 -z-1 h-full w-full bg-[url('/images/light_bg.png')] bg-cover bg-top bg-no-repeat duration-300"
          }
        ></div>
        <MessageLayoutWrapper>{children}</MessageLayoutWrapper>
      </div>
    </>
  )
}

export default MessageLayout
