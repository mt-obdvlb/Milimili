import { z } from 'zod/v4'

export const historyListDTO = z.object({
  page: z
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .default(1),
  pageSize: z
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(10),
})

export type HistoryListDTO = z.infer<typeof historyListDTO>
