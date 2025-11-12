import { z } from 'zod/v4'

export type HistoryGetTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type HistoryGetWatchAt = 'all' | 'today' | 'yesterday' | 'week' | 'customer'

export const historyGetDTO = z.object({
  kw: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .max(100, { message: '搜索关键词不能超过 100 个字符' })
    .optional(),
  time: z
    .enum(['all', '10', '10to30', '30to60', '60'], { message: '时间筛选类型不正确' })
    .default('all') as z.ZodType<HistoryGetTime>,
  watchAt: z
    .enum(['all', 'today', 'yesterday', 'week', 'customer'], { message: '观看时间筛选类型不正确' })
    .default('all') as z.ZodType<HistoryGetWatchAt>,
  from: z.coerce.date({ message: '起始时间必须是日期类型' }).optional(),
  to: z.coerce.date({ message: '结束时间必须是日期类型' }).optional(),
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .default(1),
  pageSize: z.coerce
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(20),
})

export type HistoryGetDTO = z.infer<typeof historyGetDTO>
