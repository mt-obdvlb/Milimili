import { historyGetRecent } from '@/services/history'

export const getHistoryRecent = async () => {
  const { data: historyRecentList } = await historyGetRecent()
  return { historyRecentList }
}
