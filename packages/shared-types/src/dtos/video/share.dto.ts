import { z } from 'zod/v4'

export const videoShareDTO = z.object({
  videoId: z
    .string({ message: '视频 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '视频 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '视频 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  content: z
    .string({ message: '分享内容必须是字符串类型' })
    .trim()
    .max(500, { message: '分享内容不能超过 500 个字符' })
    .optional(),
})

export type VideoShareDTO = z.infer<typeof videoShareDTO>
