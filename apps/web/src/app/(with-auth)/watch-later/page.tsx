import HeaderBarTypeTwoWrapper from '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper'
import WatchLaterWrapper from '@/features/watch-later/components/WatchLaterWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '稍后再看',
}

const WatchLater = () => {
  return (
    <>
      <header>
        <HeaderBarTypeTwoWrapper />
      </header>
      <main className={'min-h-[calc(100vh-64px)] min-w-[1060px]'}>
        <WatchLaterWrapper />
      </main>
    </>
  )
}

export default WatchLater
