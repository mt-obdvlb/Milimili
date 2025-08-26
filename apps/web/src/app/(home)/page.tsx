import HeaderBanner from '@/features/home/components/header/HeaderBanner'
import HeaderChannel from '@/features/home/components/header/HeaderChannel'
import HeaderChannelFixed from '@/features/home/components/header/HeaderChannelFixed'
import HeaderBar from '@/components/layout/header-bar/HeaderBar'
import { getCategoryList } from '@/features/category/api'
import MainRollBtn from '@/features/home/components/main/MainRollBtn'
import MainRecommendedSwiper from '@/features/home/components/main/MainRecommendedSwiper'
import MainVideoList from '@/features/home/components/main/MainVideoList'
import { getVideoList } from '@/features/video/api'
import { getSearchLogTop10 } from '@/features/search-log/api'
import LoginTip from '@/features/home/components/other/LoginTip'
import { getUserHomeInfo } from '@/features/user/api'
import { getHistoryRecent } from '@/features/history/api'
import { getFeedRecent } from '@/features/feed/api'
import { getNotificationStatistics } from '@/features'
import { getFavoriteRecent } from '@/features/favorite/api'

const Home = async () => {
  const [
    { categoryList },
    { videoSwiperList },
    { searchLogTop10List },
    { userHomeInfo },
    { historyRecentList },
    { feedRecentList },
    { notificationStatistics },
    { favoriteRecentList },
  ] = await Promise.all([
    getCategoryList(),
    getVideoList(),
    getSearchLogTop10(),
    getUserHomeInfo(),
    getHistoryRecent(),
    getFeedRecent(),
    getNotificationStatistics(),
    getFavoriteRecent(),
  ])
  return (
    <>
      <header className={'relative max-h-[2560px] min-h-[64px] bg-white'}>
        <HeaderBar
          favoriteRecentList={favoriteRecentList}
          historyRecentList={historyRecentList}
          notificationStatistics={notificationStatistics}
          feedRecentList={feedRecentList}
          userHomeInfo={userHomeInfo}
          searchLogTop10List={searchLogTop10List}
        />
        <HeaderBanner />
        <HeaderChannel categoryList={categoryList} />
        <HeaderChannelFixed categoryList={categoryList} />
      </header>
      <main className={'max-w-[calc(1920px+2*60px)] px-[60px] text-sm'}>
        <div className={'text-text1'}>
          <div className={'relative mb-[60px]'}>
            <div
              className={
                'relative grid min-h-100 w-full grid-flow-row auto-rows-auto grid-cols-5 gap-[20px]'
              }
            >
              <MainRecommendedSwiper videoSwiperList={videoSwiperList} />
              <MainVideoList />
            </div>
            <MainRollBtn />
          </div>
        </div>
      </main>
      <LoginTip />
    </>
  )
}

export default Home
