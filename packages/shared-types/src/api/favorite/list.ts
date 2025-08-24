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

export type FavoriteList = FavoriteListItem[]
