import { getSearchLogTop10, getUserHomeInfo } from '@/features'
import NotFoundHeaderBar from '@/features/not-found/components/NotFoundHeaderBar'

const HeaderBarWrapper = async () => {
  const [{ userHomeInfo }, { searchLogTop10List }] = await Promise.all([
    getUserHomeInfo(),
    getSearchLogTop10(),
  ])

  return <NotFoundHeaderBar userHomeInfo={userHomeInfo} searchLogTop10List={searchLogTop10List} />
}

export default HeaderBarWrapper
