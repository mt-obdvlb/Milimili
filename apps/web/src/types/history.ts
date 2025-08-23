export type HistoryListItem = {
  duration: number
  watchAt: string
  video: {
    id: string
    title: string
    time: number
    thumbnail: string
  }
  user: {
    name: string
    id: string
  }
}

export type HistoryListResult = {
  todayList: HistoryListItem[]
  yesterdayList: HistoryListItem[]
  lastWeekList: HistoryListItem[]
  olderList: HistoryListItem[]
}
