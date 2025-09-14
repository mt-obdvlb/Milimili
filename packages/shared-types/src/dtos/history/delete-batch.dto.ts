import { z } from 'zod/v4'

export const historyDeleteBatchDTO = z.object({
  ids: z.array(z.string()),
})

export type HistoryDeleteBatchDTO = z.infer<typeof historyDeleteBatchDTO>
