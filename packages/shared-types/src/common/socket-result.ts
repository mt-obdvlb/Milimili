export type SocketResultType = 'feed' | 'notification' | 'history' | 'favorite'

export type SocketResult<T = undefined> = {
  type: SocketResultType
  payload: T
}
