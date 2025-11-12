import { z } from 'zod/v4'
import { likeDTO } from '@/dtos'

export const likeGetDTO = likeDTO

export type LikeGetDTO = z.infer<typeof likeGetDTO>
