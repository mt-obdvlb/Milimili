import { searchLogGetTop10 } from '@/services/search-log'
import { isServer } from '@/utils'

export const getSearchLogTop10 = async () => {
  if (isServer()) await import('server-only')
  const { data: searchLogTop10List } = await searchLogGetTop10()
  console.log(searchLogTop10List)
  return {
    searchLogTop10List: searchLogTop10List,
  }
}
