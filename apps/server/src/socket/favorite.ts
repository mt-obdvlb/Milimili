import { emitToUser } from '@/socket/index'
import { io } from '@/server'

export const pushNewHistory = (userId: string) => {
  emitToUser(io, userId, 'new_favorite')
}
