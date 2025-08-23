export type UserGetInfoHomeVO = {
  user: {
    id: string
    name: string
    avatar: string
    email: string
  }
  followings: number
  followers: number
  feeds: number
}
