import { z } from 'zod/v4'

export const historyAddDTO = z.object({
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    .optional(),
  videoId: z
    .string({ message: '视频 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '视频 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '视频 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  duration: z
    .number({ message: '观看时长必须是数字类型' })
    .min(0, { message: '观看时长不能为负数' }),
})

export type HistoryAddDTO = z.infer<typeof historyAddDTO>
