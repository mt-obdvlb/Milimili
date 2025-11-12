import { z } from 'zod/v4'
import { MessageType } from '@/api'

export const messageListDTO = z.object({
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .default(1),
  pageSize: z.coerce
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(10),
  type: z
    .enum(['reply', 'at', 'like', 'system', 'whisper'], { message: '消息类型不正确' })
    .default('whisper') as z.ZodType<MessageType>,
})

export type MessageListDTO = z.infer<typeof messageListDTO>
