import { FavoriteFolderList, FavoriteRecentList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/favorites'

const API = {
  recent: '/recent',
  folderList: '/folder',
} as const

export const favoriteGetRecent = () =>
  request.get<Result<FavoriteRecentList>>(`${baseURL}${API.recent}`)

export const favoriteGetFolderList = () =>
  request.get<Result<FavoriteFolderList>>(`${baseURL}${API.folderList}`)
