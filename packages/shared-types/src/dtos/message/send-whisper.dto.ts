import { z } from 'zod/v4'

export const messageSendWhisperDTO = z.object({
  content: z.string().min(1).max(500),
  toId: z.string(),
})

export type MessageSendWhisperDTO = z.infer<typeof messageSendWhisperDTO>
