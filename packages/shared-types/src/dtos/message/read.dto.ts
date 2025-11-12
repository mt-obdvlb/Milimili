import { z } from 'zod/v4'
import { MessageType } from '@/api'

export const messageReadDTO = z.object({
  type: z.enum(['reply', 'at', 'like', 'system', 'whisper'], {
    message: '消息类型不正确',
  }) as z.ZodType<MessageType>,
})

export type MessageReadDTO = z.infer<typeof messageReadDTO>
