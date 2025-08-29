import { z } from 'zod/v4'
import { VideoSourceType, VideoStatus } from '@/api'

export const videoCreateDTO = z.object({
  url: z.url(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  thumbnail: z.string(),
  categoryId: z.string(),
  time: z.number().min(0),
  status: z
    .enum(['pending', 'scheduled', 'published'] satisfies [VideoStatus, ...VideoStatus[]])
    .optional()
    .default('published'),
  publishedAt: z.coerce
    .date()
    .optional()
    .default(() => new Date()),
  danmakuDisabled: z.boolean().optional().default(false),
  commentsDisabled: z.boolean().optional().default(false),
  sourceType: z
    .enum(['original', 'repost'] satisfies [VideoSourceType, ...VideoSourceType[]])
    .optional()
    .default('original'),
  isOpen: z.boolean().optional().default(true),
})

export type VideoCreateDTO = z.infer<typeof videoCreateDTO>
