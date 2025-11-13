import { z } from 'zod/v4'

export const favoriteListDTO = z.object({
  page: z.coerce.number().min(1, { message: '页码不能小于 1' }).default(1),
  pageSize: z.coerce
    .number()
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(10),
  favoriteFolderId: z
    .string({ message: '收藏夹 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '收藏夹 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '收藏夹 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type FavoriteListDTO = z.infer<typeof favoriteListDTO>
