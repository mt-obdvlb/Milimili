import { MESSAGE } from '@/constants'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod/v4'

export const validatorMiddleware =
  (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        code: 400,
        message: MESSAGE.INVALID_PARAMS,
      })
    }
    req.body = result.data
    next()
  }
