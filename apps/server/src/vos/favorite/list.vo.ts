export type FavoriteListItem = {
  id: string
  video: {
    title: string
    id: string
    time: number
    thumbnail: string
  }
  user: {
    name: string
    id: string
  }
}

export type FavoriteRecentItem = {
  folderId: string
  folderName: string
  list: FavoriteListItem[]
}

export type FavoriteListVO = FavoriteListItem[]

export type FavoriteRecentVO = FavoriteRecentItem[]
