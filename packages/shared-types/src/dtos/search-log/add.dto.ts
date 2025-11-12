import { z } from 'zod/v4'

export const searchLogAddDTO = z.object({
  keyword: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .min(1, { message: '搜索关键词不能为空' })
    .max(100, { message: '搜索关键词不能超过 100 个字符' }),
})

export type SearchLogAddDTO = z.infer<typeof searchLogAddDTO>
