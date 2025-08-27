import { getSocketIdByUserId } from '@/socket/index'
import { io } from '@/server'

export const pushNewHistory = (userId: string) => {
  const socketId = getSocketIdByUserId(userId)
  if (!socketId) return
  io.to(socketId).emit('new_favorite')
}
