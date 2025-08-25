import { favoriteGetFolderList, favoriteGetRecent } from '@/services/favorite'

export const getFavoriteRecent = async () => {
  const { data: favoriteRecentList } = await favoriteGetRecent()
  return {
    favoriteRecentList,
  }
}

export const getFavoriteList = async () => {
  const { data: favoriteFolderList } = await favoriteGetFolderList()
  return {
    favoriteFolderList,
  }
}
