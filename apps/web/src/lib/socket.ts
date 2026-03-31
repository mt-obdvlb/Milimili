import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const isAbsoluteSocketUrl = (value: string) => /^https?:\/\//.test(value)

export const getSocket = (): Socket => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const configuredSocketUrl = process.env.NEXT_PUBLIC_WS_URL
  const socketPath =
    configuredSocketUrl && !isAbsoluteSocketUrl(configuredSocketUrl)
      ? configuredSocketUrl
      : '/socket.io/'
  const socketBaseUrl = isDevelopment
    ? 'http://localhost:3000'
    : configuredSocketUrl && isAbsoluteSocketUrl(configuredSocketUrl)
      ? configuredSocketUrl
      : undefined

  if (!socket) {
    socket = io(socketBaseUrl, {
      withCredentials: true,
      autoConnect: false, // 不要自动连，等我们手动 connect
      path: socketPath,
      transports: isDevelopment ? undefined : ['websocket'],
    })
  }
  return socket
}
