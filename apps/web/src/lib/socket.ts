import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      withCredentials: true,
      autoConnect: false, // 不要自动连，等我们手动 connect
    })
  }
  return socket
}
