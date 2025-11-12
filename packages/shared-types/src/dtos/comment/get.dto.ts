import { z } from 'zod/v4'

export type CommentSort = 'new' | 'hot'

export const commentGetDTO = z.object({
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
  page: z.coerce.number().min(1, { message: '页码不能小于 1' }).default(1),
  pageSize: z.coerce
    .number()
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(20),
  sort: z.enum(['new', 'hot'], { message: '排序类型必须是 new 或 hot' }).default('hot'),
})

export type CommentGetDTO = z.infer<typeof commentGetDTO>
