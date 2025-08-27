import { favoriteGetRecent } from '@/services/favorite'
import { useQuery } from '@tanstack/react-query'

export const useFavoriteGetRecent = () => {
  const { data: favoriteRecentList } = useQuery({
    queryKey: ['favorite', 'recent'],
    queryFn: () => favoriteGetRecent(),
  })
  return {
    favoriteRecentList: favoriteRecentList?.data,
  }
}
