import { z } from 'zod/v4'

export const commentDTO = z.object({
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
  content: z
    .string({ message: '评论内容必须是字符串类型' })
    .trim()
    .min(1, { message: '评论内容不能为空' })
    .max(1000, { message: '评论内容不能超过 1000 个字符' }),
})

export type CommentDTO = z.infer<typeof commentDTO>
