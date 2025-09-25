import { z } from 'zod/v4'
import { MessageType } from '@/api'

export const messageListDTO = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  type: z
    .enum(['reply', 'at', 'like', 'system', 'whisper'])
    .default('reply') as z.ZodType<MessageType>,
})

export type MessageListDTO = z.infer<typeof messageListDTO>
