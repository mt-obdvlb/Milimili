import { z } from 'zod/v4'

export const feedCreateDTO = z.object({
  content: z
    .string({ message: '动态内容必须是字符串类型' })
    .trim()
    .min(1, { message: '动态内容不能为空' })
    .max(1000, { message: '动态内容不能超过 1000 个字符' }),
  title: z
    .string({ message: '标题必须是字符串类型' })
    .trim()
    .max(20, { message: '标题不能超过 20 个字符' })
    .optional(),
  imageUrls: z.array(z.url({ message: '图片 URL 必须是有效的 URL 地址' })).optional(),
})

export type FeedCreateDTO = z.infer<typeof feedCreateDTO>
