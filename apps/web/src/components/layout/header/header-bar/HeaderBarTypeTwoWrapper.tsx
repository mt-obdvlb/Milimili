import { getSearchLogTop10, getUserHomeInfo } from '@/features'
import HeaderBarTypeTwo from '@/components/layout/header/header-bar/HeaderBarTypeTwo'

const HeaderBarWrapper = async () => {
  const [{ userHomeInfo }, { searchLogTop10List }] = await Promise.all([
    getUserHomeInfo(),
    getSearchLogTop10(),
  ])

  return <HeaderBarTypeTwo userHomeInfo={userHomeInfo} searchLogTop10List={searchLogTop10List} />
}

export default HeaderBarWrapper
