import { z } from 'zod/v4'

export const historyListDTO = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
})

export type HistoryListDTO = z.infer<typeof historyListDTO>
