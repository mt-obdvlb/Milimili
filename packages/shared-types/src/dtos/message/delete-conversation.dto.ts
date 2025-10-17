import { z } from 'zod/v4'

export const messageDeleteConversationDTO = z.object({
  conversationId: z.string(),
})

export type MessageDeleteConversationDTO = z.infer<typeof messageDeleteConversationDTO>
