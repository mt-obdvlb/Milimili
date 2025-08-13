export type Result<T = undefined> = {
  code: number
  message?: string
  data?: T
}

export type PageResult<T> = {
  total: number
  list: T[]
}

export type NoParams = Record<string, never>
