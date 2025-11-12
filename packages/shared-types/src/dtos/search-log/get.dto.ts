import { z } from 'zod/v4'

export const searchLogGetDTO = z.object({
  keyword: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .max(100, { message: '搜索关键词不能超过 100 个字符' })
    .optional(),
})

export type SearchLogGetDTO = z.infer<typeof searchLogGetDTO>
