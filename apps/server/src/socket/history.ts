import { io } from '@/server'
import { emitToUser } from '@/socket/index'

export const pushNewHistory = (userId: string) => {
  emitToUser(io, userId, 'new_history')
}
