import HeaderBar from '@/components/layout/header/header-bar/HeaderBar'
import { getSearchLogTop10, getUserHomeInfo } from '@/features'

const HeaderBarWrapper = async ({ isFixed }: { isFixed?: boolean }) => {
  const [{ userHomeInfo }, { searchLogTop10List }] = await Promise.all([
    getUserHomeInfo(),
    getSearchLogTop10(),
  ])

  return (
    <HeaderBar
      userHomeInfo={userHomeInfo}
      isFixed={isFixed}
      searchLogTop10List={searchLogTop10List}
    />
  )
}

export default HeaderBarWrapper
