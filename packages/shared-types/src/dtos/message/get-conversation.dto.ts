import { z } from 'zod/v4'

export const messageGetConversationDTO = z.object({
  userId: z.string(),
})

export type MessageGetConversationDTO = z.infer<typeof messageGetConversationDTO>
