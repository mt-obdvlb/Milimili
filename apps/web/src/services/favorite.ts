import { FavoriteRecentList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/favorites'

const API = {
  recent: '/recent',
} as const

export const favoriteGetRecent = () =>
  request.get<Result<FavoriteRecentList>>(`${baseURL}${API.recent}`)
