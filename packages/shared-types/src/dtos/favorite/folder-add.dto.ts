import { z } from 'zod/v4'

export const favoriteFolderAddDTO = z.object({
  name: z
    .string({ message: '收藏夹名称必须是字符串类型' })
    .trim()
    .min(1, { message: '收藏夹名称不能为空' })
    .max(20, { message: '收藏夹名称不能超过 20 个字符' })
    .regex(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, {
      message: '收藏夹名称只能包含中文、字母、数字或下划线',
    }),
  description: z
    .string({ message: '描述必须是字符串类型' })
    .trim()
    .max(200, { message: '描述不能超过 200 个字符' })
    .optional(),
  thumbnail: z.url({ message: '缩略图必须是有效的 URL 地址' }).optional(),
})

export type FavoriteFolderAddDTO = z.infer<typeof favoriteFolderAddDTO>
