import { z } from 'zod/v4'

export const feedListDTO = z.object({
  page: z.coerce.number().min(1, { message: '页码不能小于 1' }).default(1),
  pageSize: z.coerce
    .number()
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(20),
  type: z
    .enum(['all', 'video', 'image-text'], { message: '动态类型必须是 all、video 或 image-text' })
    .default('all'),
  userId: z.string({ message: '用户 ID 必须是字符串类型' }).trim().optional(),
})

export type FeedListDTO = z.infer<typeof feedListDTO>
