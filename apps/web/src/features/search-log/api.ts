import { searchLogGetTop10 } from '@/services/search-log'

export const getSearchLogTop10 = async () => {
  const { data: searchLogTop10List } = await searchLogGetTop10()
  console.log(searchLogTop10List)
  return {
    searchLogTop10List: searchLogTop10List,
  }
}
