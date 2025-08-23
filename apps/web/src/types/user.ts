export type User = {
  name: string
  email: string
  avatar: string
  id: string
}

export type UserLoginByNameRequest = {
  password: string
  name: string
}

export type UserLoginByEmailRequest = {
  code: string
  email: string
}

export type UserLoginRequest = UserLoginByNameRequest | UserLoginByEmailRequest

export type UserGetResponse = User
