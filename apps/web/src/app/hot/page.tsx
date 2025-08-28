import HeaderBarWrapper from '@/components/layout/header-bar/HeaderBarWrapper'
import HeaderBanner from '@/components/layout/header-banner/HeaderBanner'
import HotTabs from '@/features/hot/components/HotTabs'

const Hot = () => {
  return (
    <>
      <header className={'relative max-h-[2560px] min-h-[64px] bg-white'}>
        <HeaderBarWrapper />
        <HeaderBanner />
      </header>
      <main className={'mx-auto my-0 max-w-[1483px] cursor-default'}>
        <HotTabs />
      </main>
    </>
  )
}

export default Hot
