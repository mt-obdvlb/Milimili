import { z } from 'zod/v4'

export const followGetDTO = z.object({
  followingId: z
    .string({ message: '关注对象 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '关注对象 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '关注对象 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type FollowGetDTO = z.infer<typeof followGetDTO>
