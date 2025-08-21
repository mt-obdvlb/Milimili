import { FavoriteFolderType } from '@mtobdvlb/shared-types'

export type FavoriteFolderListItem = {
  id: string
  name: string
  number: number
  type: FavoriteFolderType
}

export type FavoriteFolderListVO = FavoriteFolderListItem[]
