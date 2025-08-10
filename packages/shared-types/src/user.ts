export type UserBase = {
  name?: string
  email: string
  avatar?: string
}

export type UserDB = UserBase & {
  password?: string
}

export type User = UserBase & {
  id: string
  createdAt: string
  updatedAt: string
}
