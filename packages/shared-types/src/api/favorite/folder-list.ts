import { FavoriteFolderType } from '@/api'

export type FavoriteFolderListItem = {
  id: string
  name: string
  number: number
  type: FavoriteFolderType
  thumbnail?: string
  description?: string
}

export type FavoriteFolderList = FavoriteFolderListItem[]
