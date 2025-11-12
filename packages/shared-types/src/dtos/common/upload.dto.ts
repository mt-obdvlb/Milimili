import { z } from 'zod/v4'

export const commonUploadDTO = z.object({
  fileName: z
    .string({ message: '文件名必须是字符串类型' })
    .trim()
    .min(1, { message: '文件名不能为空' })
    .max(255, { message: '文件名不能超过 255 个字符' })
    .regex(/^[^\\/:*?"<>|]+$/, { message: '文件名不能包含 \\ / : * ? " < > | 等非法字符' }),
})

export type CommonUploadDTO = z.infer<typeof commonUploadDTO>
