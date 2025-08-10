import { Types } from 'mongoose'

export type FavoriteBase = object

export type FavoriteDB = FavoriteBase & {
  userId: Types.ObjectId
  videoId: Types.ObjectId
  folderId: Types.ObjectId
}

export type Favorite = FavoriteBase & {
  userId: string
  videoId: string
  folderId: string
  id: string
  createdAt: string
  updatedAt: string
}

export type FavoriteFolderType = 'default' | 'watch_later' | 'normal'

export type FavoriteFolderBase = {
  name: string
  description?: string
  type: FavoriteFolderType
  isOpen: boolean
  thumbnail: string
}

export type FavoriteFolderDB = FavoriteFolderBase & {
  userId: Types.ObjectId
}

export type FavoriteFolder = FavoriteFolderBase & {
  userId: string
  id: string
  createdAt: string
  updatedAt: string
}
