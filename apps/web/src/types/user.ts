export type User = {
  name: string
  email: string
  avatar: string
  id: string
}

export type UserHomeInfoResult = {
  user: User
  followings: number
  followers: number
  feeds: number
}

export type UserLoginByNameRequest = {
  password: string
  email: string
}

export type UserLoginByEmailRequest = {
  code: string
  email: string
}

export type UserLoginRequest = UserLoginByNameRequest | UserLoginByEmailRequest

export type UserGetResponse = User
