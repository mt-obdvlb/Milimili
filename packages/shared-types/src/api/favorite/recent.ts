import { FavoriteListItem } from './list'

export type FavoriteRecentItem = {
  folderId: string
  folderName: string
  list: FavoriteListItem[]
}
export type FavoriteRecentList = FavoriteRecentItem[]
