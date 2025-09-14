export type HistoryGetItem = {
  title: string
  thumbnail: string
  time: number
  username: string
  userId: string
  url: string
  duration: number
  isFavorite: boolean
  watchAt: string
  videoId: string
}

export type HistoryGetList = HistoryGetItem[]
