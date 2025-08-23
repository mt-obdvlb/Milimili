export type Result<T = undefined> = {
  code: number
  message?: string
  data?: T
}
