import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  const url = process.env.NEXT_PUBLIC_WS_URL || '/socket.io/'
  if (!socket) {
    socket = io(url, {
      withCredentials: true,
      autoConnect: false, // 不要自动连，等我们手动 connect
    })
  }
  return socket
}
