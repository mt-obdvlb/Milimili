import { emitToUser } from '@/socket/index'
import { io } from '@/server'

export const pushNewNotification = (userId: string) => {
  emitToUser(io, userId, 'new_notification')
}
