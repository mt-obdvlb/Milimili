import { z } from 'zod/v4'

export type VideoGetWatchLaterType = 'all' | 'not_watched'
export type VideoGetWatchLaterSort = 'latest' | 'first'
export type VideoGetWatchLaterTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type VideoGetWatchLaterAddAt = 'all' | 'today' | 'yesterday' | 'week' | 'customer'

export const videoGetWatchLaterDTO = z.object({
  kw: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .max(50, { message: '搜索关键词不能超过 50 个字符' })
    .optional(),
  sort: z
    .enum(['latest', 'first'], { message: '排序类型不正确' })
    .default('latest') as z.ZodType<VideoGetWatchLaterSort>,
  type: z
    .enum(['all', 'not_watched'], { message: '观看状态类型不正确' })
    .default('all') as z.ZodType<VideoGetWatchLaterType>,
  time: z
    .enum(['all', '10', '10to30', '30to60', '60'], { message: '观看时长筛选类型不正确' })
    .default('all') as z.ZodType<VideoGetWatchLaterTime>,
  addAt: z
    .enum(['all', 'today', 'yesterday', 'week', 'customer'], { message: '添加时间筛选类型不正确' })
    .default('all') as z.ZodType<VideoGetWatchLaterAddAt>,
  from: z.coerce.date({ message: '起始时间必须是日期类型' }).optional(),
  to: z.coerce.date({ message: '结束时间必须是日期类型' }).optional(),
})

export type VideoGetWatchLaterDTO = z.infer<typeof videoGetWatchLaterDTO>
