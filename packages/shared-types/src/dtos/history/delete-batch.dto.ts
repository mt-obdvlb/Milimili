import { z } from 'zod/v4'

export const historyDeleteBatchDTO = z.object({
  videoIds: z
    .array(
      z
        .string({ message: ' ID 必须是字符串类型' })
        .trim()
        .min(1, { message: ' ID 不能为空' })
        .regex(/^[a-f\d]{24}$/i, {
          message: ' ID 格式不正确，必须是有效的 MongoDB ObjectId',
        })
    )
    .min(1, { message: '历史记录 ID 列表不能为空' }),
})

export type HistoryDeleteBatchDTO = z.infer<typeof historyDeleteBatchDTO>
