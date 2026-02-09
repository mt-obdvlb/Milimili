import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  //本地版
  const url = 'http://localhost:3000'
  //部署版
  // const url = '/socket.io/'
  if (!socket) {
    socket = io(url, {
      withCredentials: true,
      autoConnect: false, // 不要自动连，等我们手动 connect
    })
  }
  return socket
}
