import { searchLogGetTop10 } from '@/services/search-log'

export const getSearchLogTop10 = async () => {
  const { data: searchLogTop10List } = await searchLogGetTop10()
  return {
    searchLogTop10List: searchLogTop10List,
  }
}
