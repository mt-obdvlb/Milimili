import { getSearchLogTop10, getUserHomeInfo } from '@/features'
import HeaderBarTypeTwo from '@/components/layout/header/header-bar/HeaderBarTypeTwo'

const HeaderBarWrapper = async ({ hidden }: { hidden?: boolean }) => {
  const [{ userHomeInfo }, { searchLogTop10List }] = await Promise.all([
    getUserHomeInfo(),
    getSearchLogTop10(),
  ])

  return (
    <HeaderBarTypeTwo
      userHomeInfo={userHomeInfo}
      hidden={hidden}
      searchLogTop10List={searchLogTop10List}
    />
  )
}

export default HeaderBarWrapper
