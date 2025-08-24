import { feedGetRecent } from '@/services/feed'

export const getFeedRecent = async () => {
  const { data: feedRecentList } = await feedGetRecent()
  return { feedRecentList }
}
