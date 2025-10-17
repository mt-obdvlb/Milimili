import { z } from 'zod/v4'

export const messageGetConversationDTO = z.object({
  conversationId: z.string(),
})

export type MessageGetConversationDTO = z.infer<typeof messageGetConversationDTO>
