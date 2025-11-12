import { z } from 'zod/v4'

export const videoListDTO = z.object({
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .default(1),
  pageSize: z.coerce
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(4),
})

export type VideoListDTO = z.infer<typeof videoListDTO>
