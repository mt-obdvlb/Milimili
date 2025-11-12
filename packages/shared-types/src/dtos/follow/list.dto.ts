import { z } from 'zod/v4'

export const followListDTO = z.object({
  page: z.coerce
    .number()
    .min(1, { message: '页码不能小于 1' })
    .max(1000, { message: '页码不能超过 1000' })
    .default(1),
  pageSize: z.coerce
    .number()
    .min(1, { message: '每页数量不能小于 1' })
    .max(100, { message: '每页数量不能超过 100' })
    .default(10),
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '用户 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  type: z
    .enum(['following', 'follower'], { message: '类型必须是 following 或 follower' })
    .default('following'),
})

export type FollowListDTO = z.infer<typeof followListDTO>
