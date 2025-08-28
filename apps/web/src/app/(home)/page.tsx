import HeaderChannel from '@/components/layout/header/header-channel/HeaderChannel'
import HomeHeaderChannelFixed from '@/features/home/components/header/HomeHeaderChannelFixed'
import { getCategoryList } from '@/features/category/api'
import HomeMainRollBtn from '@/features/home/components/main/HomeMainRollBtn'
import RecommendedSwiper from '@/components/layout/Swiper/RecommendedSwiper'
import HomeMainVideoList from '@/features/home/components/main/HomeMainVideoList'
import { getVideoList } from '@/features/video/api'
import HomeLoginTip from '@/features/home/components/other/HomeLoginTip'
import HeaderBarWrapper from '@/components/layout/header/header-bar/HeaderBarWrapper'
import HomePaletteButton from '@/features/home/components/other/HomePaletteButton'
import HeaderBanner from '@/components/layout/header/header-banner/HeaderBanner'

const Home = async () => {
  const [{ categoryList }, { videoSwiperList }] = await Promise.all([
    getCategoryList(),
    getVideoList(),
  ])
  return (
    <>
      <header className={'relative max-h-[2560px] min-h-[64px] bg-white'}>
        <HeaderBarWrapper />
        <HeaderBanner />
        <HeaderChannel categoryList={categoryList} />
        <HomeHeaderChannelFixed categoryList={categoryList} />
      </header>
      <main className={'max-w-[calc(1920px+2*60px)] px-[60px] text-sm'}>
        <div className={'text-text1'}>
          <div className={'relative mb-[60px]'}>
            <div
              className={
                'relative grid min-h-100 w-full grid-flow-row auto-rows-auto grid-cols-5 gap-[20px]'
              }
            >
              <RecommendedSwiper videoSwiperList={videoSwiperList} />
              <HomeMainVideoList />
            </div>
            <HomeMainRollBtn />
          </div>
        </div>
      </main>
      <HomeLoginTip />
      <HomePaletteButton />
    </>
  )
}

export default Home
