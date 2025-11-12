import { z } from 'zod/v4'

export const categoryCreateDTO = z.object({
  name: z
    .string({
      message: '分类名称必须是字符串类型',
    })
    .trim()
    .min(1, { message: '分类名称不能为空' })
    .max(30, { message: '分类名称不能超过 30 个字符' })
    .regex(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, {
      message: '分类名称只能包含中文、字母、数字或下划线',
    }),
})

export type CategoryCreateDTO = z.infer<typeof categoryCreateDTO>
