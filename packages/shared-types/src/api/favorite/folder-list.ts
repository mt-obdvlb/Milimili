import { FavoriteFolderType } from './base'

export type FavoriteFolderListItem = {
  id: string
  name: string
  number: number
  type: FavoriteFolderType
}

export type FavoriteFolderList = FavoriteFolderListItem[]
