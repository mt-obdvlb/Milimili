import { z } from 'zod/v4'

export const messageCreateConversationDTO = z.object({
  userId: z.string(),
})

export type MessageCreateConversationDTO = z.infer<typeof messageCreateConversationDTO>
