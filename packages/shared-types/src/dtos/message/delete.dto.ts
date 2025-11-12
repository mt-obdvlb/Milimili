import { z } from 'zod/v4'

export const messageDeleteDTO = z.object({
  id: z
    .string({ message: '消息 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '消息 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '消息 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type MessageDeleteDTO = z.infer<typeof messageDeleteDTO>
