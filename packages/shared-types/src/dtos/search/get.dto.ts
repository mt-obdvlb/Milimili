import { z } from 'zod/v4'

export type SearchType = 'all' | 'video' | 'user'
export type SearchSort = 'all' | 'publishedAt' | 'view' | 'danmaku' | 'favorite'
export type SearchTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type SearchPublishedAt = 'all' | 'today' | 'week' | 'halfYear' | 'customer'

export const searchGetDTO = z.object({
  kw: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .min(1, { message: '搜索关键词不能为空' })
    .max(20, { message: '搜索关键词不能超过 20 个字符' }),
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .max(1000, { message: '页码不能超过 1000' })
    .default(1),
  type: z
    .enum(['all', 'video', 'user'], { message: '搜索类型不正确' })
    .default('all') as z.ZodType<SearchType>,
  sort: z
    .enum(['all', 'publishedAt', 'view', 'danmaku', 'favorite'], { message: '排序类型不正确' })
    .default('all') as z.ZodType<SearchSort>,
  time: z
    .enum(['all', '10', '10to30', '30to60', '60'], { message: '时间筛选类型不正确' })
    .default('all') as z.ZodType<SearchTime>,
  publishedAt: z
    .enum(['all', 'today', 'week', 'halfYear', 'customer'], { message: '发布日期筛选类型不正确' })
    .default('all') as z.ZodType<SearchPublishedAt>,
  from: z.coerce.date({ message: '起始时间必须是日期类型' }).optional(),
  to: z.coerce.date({ message: '结束时间必须是日期类型' }).optional(),
})

export type SearchGetDTO = z.infer<typeof searchGetDTO>
