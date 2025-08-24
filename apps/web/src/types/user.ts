export type UserLoginByNameRequest = {
  password: string
  email: string
}

export type UserLoginByEmailRequest = {
  code: string
  email: string
}

export type UserLoginRequest = UserLoginByNameRequest | UserLoginByEmailRequest
