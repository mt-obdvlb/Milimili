import { z } from 'zod/v4'

export const messageDeleteConversationDTO = z.object({
  conversationId: z
    .string({ message: '会话 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '会话 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '会话 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type MessageDeleteConversationDTO = z.infer<typeof messageDeleteConversationDTO>
