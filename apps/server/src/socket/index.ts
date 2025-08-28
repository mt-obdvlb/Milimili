import { Server, Socket } from 'socket.io'
import http from 'http'
import { verifyToken } from '@/utils'
import { AuthService } from '@/services'

// 定义 Socket 上拓展属性类型
export interface AuthenticatedSocket extends Socket {
  userId: string
}

// 用户 map: userId -> socketId[] (Set 保证不重复)
const userSocketMap = new Map<string, Set<string>>()

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  })

  console.log('🚀 Socket 服务已启动')

  // 中间件验证 token
  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie
    if (!cookieHeader) return next(new Error('No cookie'))

    const accessMatch = cookieHeader.match(/access_token=([^;]+)/)
    const refreshMatch = cookieHeader.match(/refresh_token=([^;]+)/)

    const accessToken = accessMatch?.[1]
    const refreshToken = refreshMatch?.[1]

    let payload

    try {
      payload = accessToken ? verifyToken(accessToken) : null
    } catch {
      return next(new Error('Unauthorized'))
    }

    if (!payload) {
      if (!refreshToken) return next(new Error('Unauthorized'))

      try {
        const { accessToken: newAccessToken } = await AuthService.refreshToken(refreshToken)
        payload = verifyToken(newAccessToken)
      } catch {
        return next(new Error('Unauthorized'))
      }
    }

    if (!payload) return next(new Error('Unauthorized'))
    ;(socket as AuthenticatedSocket).userId = payload.id
    next()
  })

  io.on('connect', (socket) => {
    const authSocket = socket as AuthenticatedSocket
    const userId = authSocket.userId

    // 添加 socketId
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set())
    }
    userSocketMap.get(userId)!.add(authSocket.id)

    console.log('✅ 用户已连接:', userId, authSocket.id)

    socket.on('disconnect', () => {
      const socketSet = userSocketMap.get(userId)
      if (socketSet) {
        socketSet.delete(authSocket.id)
        if (socketSet.size === 0) {
          userSocketMap.delete(userId)
        }
      }
      console.log('❌ 用户断开:', userId, authSocket.id)
    })
  })

  return io
}

// 获取某用户所有 socketId
export const getSocketIdsByUserId = (userId: string) => userSocketMap.get(userId) ?? new Set()

// 向某个用户的所有连接广播消息
export const emitToUser = <T = undefined>(io: Server, userId: string, event: string, data?: T) => {
  const socketIds = getSocketIdsByUserId(userId)
  for (const socketId of socketIds) {
    io.to(socketId).emit(event, data)
  }
}
