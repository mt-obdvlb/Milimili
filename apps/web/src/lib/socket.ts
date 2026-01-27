import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('/socket.io/', {
      withCredentials: true,
      autoConnect: false, // 不要自动连，等我们手动 connect
    })
  }
  return socket
}
