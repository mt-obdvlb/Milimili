import { z } from 'zod/v4'
import { VideoSourceType, VideoStatus } from '@/api'

export const videoCreateDTO = z.object({
  url: z.url({ message: '视频 URL 必须是有效的 URL' }),
  title: z
    .string({ message: '视频标题必须是字符串类型' })
    .trim()
    .min(1, { message: '视频标题不能为空' })
    .max(200, { message: '视频标题不能超过 200 个字符' }),
  description: z
    .string({ message: '视频描述必须是字符串类型' })
    .max(1000, { message: '视频描述不能超过 1000 个字符' })
    .optional(),
  thumbnail: z.url({ message: '视频封面必须是有效的 URL' }),
  categoryId: z
    .string({ message: '分类 ID 必须是字符串类型' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: '分类 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
  time: z.number({ message: '视频时长必须是数字类型' }).min(0, { message: '视频时长不能为负数' }),
  status: z
    .enum(['pending', 'scheduled', 'published'], { message: '视频状态不正确' })
    .optional()
    .default('published') as z.ZodType<VideoStatus>,
  publishedAt: z.coerce
    .date({ message: '发布时间必须是日期类型' })
    .optional()
    .default(() => new Date()),
  danmakuDisabled: z.boolean().optional().default(false),
  commentsDisabled: z.boolean().optional().default(false),
  sourceType: z
    .enum(['original', 'repost'], { message: '视频来源类型不正确' })
    .optional()
    .default('original') as z.ZodType<VideoSourceType>,
  isOpen: z.boolean().optional().default(true),
})

export type VideoCreateDTO = z.infer<typeof videoCreateDTO>
