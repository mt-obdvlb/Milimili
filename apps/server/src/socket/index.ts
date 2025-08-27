import { Server, Socket } from 'socket.io'
import http from 'http'
import { verifyToken } from '@/utils'
import { AuthService } from '@/services'

// 定义 Socket 上拓展属性类型
export interface AuthenticatedSocket extends Socket {
  userId: string
}

// 用户 map
const userSocketMap = new Map<string, string>() // userId -> socketId

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

    // 获取 token
    const accessMatch = cookieHeader.match(/access_token=([^;]+)/)
    const refreshMatch = cookieHeader.match(/refresh_token=([^;]+)/)
    console.log(accessMatch, refreshMatch)

    const accessToken = accessMatch?.[1]
    const refreshToken = refreshMatch?.[1]

    let payload = accessToken ? verifyToken(accessToken) : null

    // access_token 不存在或过期，尝试 refresh_token
    if (!payload) {
      if (!refreshToken) return next(new Error('Unauthorized'))

      try {
        const { accessToken: newAccessToken } = await AuthService.refreshToken(refreshToken)
        payload = verifyToken(newAccessToken)
      } catch {
        return next(new Error('Unauthorized'))
      }
    }

    if (!payload)
      return next(new Error('Unauthorized'))

      // TS 安全绑定 userId
    ;(socket as AuthenticatedSocket).userId = payload.id
    next()
  })

  io.on('connect', (socket) => {
    const authSocket = socket as AuthenticatedSocket
    const userId = authSocket.userId
    userSocketMap.set(userId, authSocket.id)

    console.log('✅ 用户已连接:', userId, authSocket.id)

    socket.on('disconnect', () => {
      userSocketMap.delete(userId)
      console.log('❌ 用户断开:', userId)
    })
  })

  return io
}

// 导出工具
export const getSocketIdByUserId = (userId: string) => userSocketMap.get(userId)
