import HeaderBar from '@/components/layout/header-bar/HeaderBar'
import { getSearchLogTop10, getUserHomeInfo } from '@/features'

const HeaderBarWrapper = async () => {
  const [{ userHomeInfo }, { searchLogTop10List }] = await Promise.all([
    getUserHomeInfo(),
    getSearchLogTop10(),
  ])

  return <HeaderBar userHomeInfo={userHomeInfo} searchLogTop10List={searchLogTop10List} />
}

export default HeaderBarWrapper
