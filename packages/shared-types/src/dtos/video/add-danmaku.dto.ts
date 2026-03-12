import { z } from 'zod/v4'

export const videoAddDanmakuDTO = z.object({
  userId: z
    .string({ message: '用户 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '用户 ID 格式不正确，必须是有效的 MongoDB ObjectId' })
    .optional(),
  videoId: z
    .string({ message: '视频 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '视频 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '视频 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  content: z
    .string({ message: '弹幕内容必须是字符串类型' })
    .trim()
    .min(1, { message: '弹幕内容不能为空' })
    .max(100, { message: '弹幕内容不能超过 100 个字符' }),
  position: z.enum(['top', 'bottom', 'scroll'], { message: '弹幕位置类型不正确' }),
  time: z.number({ message: '弹幕时间必须是数字类型' }).min(0, { message: '弹幕时间不能为负数' }),
  color: z
    .string({ message: '弹幕颜色必须是字符串类型' })
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: '弹幕颜色必须是有效的 HEX 颜色，如 #FFFFFF' })
    .default('#FFFFFF'),
  fontSize: z
    .number({ message: '弹幕字号必须是数字类型' })
    .min(12, { message: '弹幕字号不能小于 12' })
    .max(36, { message: '弹幕字号不能大于 36' })
    .default(24),
})

export type VideoAddDanmakuDTO = z.infer<typeof videoAddDanmakuDTO>
