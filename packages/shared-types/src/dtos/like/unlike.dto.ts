import { z } from 'zod/v4'
import { likeDTO } from '@/dtos'

export const unlikeDTO = likeDTO

export type UnlikeDTO = z.infer<typeof unlikeDTO>
