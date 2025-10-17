import { z } from 'zod/v4'

export const messageDeleteDTO = z.object({
  id: z.string().min(1),
})

export type MessageDeleteDTO = z.infer<typeof messageDeleteDTO>
