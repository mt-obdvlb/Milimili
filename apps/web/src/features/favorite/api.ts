import { favoriteGetRecent } from '@/services/favorite'

export const getFavoriteRecent = async () => {
  const { data: favoriteRecentList } = await favoriteGetRecent()
  return {
    favoriteRecentList,
  }
}
