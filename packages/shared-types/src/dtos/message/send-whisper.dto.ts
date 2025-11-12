import { z } from 'zod/v4'

export const messageSendWhisperDTO = z.object({
  content: z
    .string({ message: '私信内容必须是字符串类型' })
    .trim()
    .min(1, { message: '私信内容不能为空' })
    .max(500, { message: '私信内容不能超过 500 个字符' }),
  toId: z
    .string({ message: '接收者 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '接收者 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '接收者 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type MessageSendWhisperDTO = z.infer<typeof messageSendWhisperDTO>
