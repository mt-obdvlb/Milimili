import { z } from 'zod/v4'

export const favoriteMoveBatchDTO = z.object({
  ids: z
    .array(
      z
        .string({ message: '收藏 ID 必须是字符串类型' })
        .trim()
        .min(1, { message: '收藏 ID 不能为空' })
        .regex(/^[a-f\d]{24}$/i, { message: '收藏 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    )
    .min(1, { message: '收藏 ID 列表不能为空' }),
  targetFolderId: z
    .string({ message: '目标收藏夹 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '目标收藏夹 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, {
      message: '目标收藏夹 ID 格式不正确，必须是有效的 MongoDB ObjectId',
    }),
})

export type FavoriteMoveBatchDTO = z.infer<typeof favoriteMoveBatchDTO>
