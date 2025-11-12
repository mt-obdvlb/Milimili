import { z } from 'zod/v4'

export const favoriteAddDTO = z.object({
  videoId: z
    .string({ message: '视频 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '视频 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '视频 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '用户 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  folderId: z
    .string({ message: '收藏夹 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '收藏夹 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '收藏夹 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type FavoriteAddDTO = z.infer<typeof favoriteAddDTO>
