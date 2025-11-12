import { z } from 'zod/v4'

export const messageCreateConversationDTO = z.object({
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '用户 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type MessageCreateConversationDTO = z.infer<typeof messageCreateConversationDTO>
