import { FeedRecentList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/feeds'

const API = {
  recent: '/recent',
} as const

export const feedGetRecent = () => request.get<Result<FeedRecentList>>(`${baseURL}${API.recent}`)
