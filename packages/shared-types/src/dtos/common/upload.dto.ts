import { z } from 'zod/v4'

export const commonUploadDTO = z.object({
  fileName: z.string(),
})

export type CommonUploadDTO = z.infer<typeof commonUploadDTO>
