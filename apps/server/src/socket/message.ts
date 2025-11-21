import { emitToUser } from '@/socket/index'
import { io } from '@/server'

export const pushNewMessage = (userId: string) => {
  emitToUser(io, userId, 'new_notification')
}

export const pushNewWhisper = (userId: string) => {
  emitToUser(io, userId, 'new_whisper')
}
