export type CategoryBase = {
  name: string
}

export type CategoryDB = CategoryBase & {}

export type Category = CategoryBase & {
  id: string
  createdAt: string
  updatedAt: string
}
