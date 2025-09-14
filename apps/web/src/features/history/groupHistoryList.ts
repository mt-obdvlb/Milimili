import { HistoryGetList } from '@mtobdvlb/shared-types'

type GroupedHistory = {
  label: string
  value: HistoryGetList
}

export const groupHistoryList = (historyList?: HistoryGetList): GroupedHistory[] => {
  if (!historyList) return []

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(todayStart)
  monthStart.setMonth(monthStart.getMonth() - 1)

  const groups: {
    today: HistoryGetList
    yesterday: HistoryGetList
    week: HistoryGetList
    month: HistoryGetList
    earlier: HistoryGetList
  } = {
    today: [],
    yesterday: [],
    week: [],
    month: [],
    earlier: [],
  }

  for (const item of historyList) {
    const watchedDate = new Date(item.watchAt)

    if (watchedDate >= todayStart) {
      groups.today.push(item)
    } else if (watchedDate >= yesterdayStart && watchedDate < todayStart) {
      groups.yesterday.push(item)
    } else if (watchedDate >= weekStart) {
      groups.week.push(item)
    } else if (watchedDate >= monthStart) {
      groups.month.push(item)
    } else {
      groups.earlier.push(item)
    }
  }

  return [
    { label: '今天', value: groups.today },
    { label: '昨天', value: groups.yesterday },
    { label: '近一周', value: groups.week },
    { label: '一个月内', value: groups.month },
    { label: '更早', value: groups.earlier },
  ].filter((group) => group.value.length > 0) // 过滤掉空组
}
