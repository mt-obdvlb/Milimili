import { z } from 'zod/v4'

export const unlikeDTO = z.object({
  feedId: z
    .string({ message: '动态 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '动态 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    .optional(),
  commentId: z
    .string({ message: '评论 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '评论 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    .optional(),
  videoId: z
    .string({ message: '视频 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '视频 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    .optional(),
})

export type UnlikeDTO = z.infer<typeof unlikeDTO>
