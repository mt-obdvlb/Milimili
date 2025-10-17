import { z } from 'zod/v4'
import { MessageType } from '@/api'

export const messageReadDTO = z.object({
  type: z.enum(['reply', 'at', 'like', 'system', 'whisper'] satisfies MessageType[]),
})

export type MessageReadDTO = z.infer<typeof messageReadDTO>
