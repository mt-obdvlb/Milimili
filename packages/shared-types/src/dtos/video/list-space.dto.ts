import { z } from 'zod/v4'

export type VideoListSort = 'publishedAt' | 'views' | 'favorites'

export const videoListSpaceDTO = z.object({
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '用户 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .default(1),
  pageSize: z.coerce
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(10),
  sort: z
    .enum(['views', 'publishedAt', 'favorites'], { message: '排序类型不正确' })
    .default('publishedAt') as z.ZodType<VideoListSort>,
})

export type VideoListSpaceDTO = z.infer<typeof videoListSpaceDTO>
