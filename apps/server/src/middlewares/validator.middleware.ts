import { MESSAGE } from '@/constants'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod/v4'

type SchemaGroup = {
  body?: z.ZodSchema
  query?: z.ZodSchema
  params?: z.ZodSchema
}

export const validatorMiddleware =
  (schemas: SchemaGroup) => (req: Request, res: Response, next: NextFunction) => {
    console.log('query', req.query, 'body', req.body, 'params', req.params)
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body)
      if (!bodyResult.success) {
        const message = bodyResult.error.issues.map((issue) => issue.message).join('\n')
        return res.status(400).json({
          code: 1,
          message: message || MESSAGE.INVALID_PARAMS,
        })
      }
      req.body = bodyResult.data
    }

    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query)
      if (!queryResult.success) {
        const message = queryResult.error.issues.map((issue) => issue.message).join('\n')

        return res.status(400).json({
          code: 1,
          message: message || MESSAGE.INVALID_PARAMS,
        })
      }
      req.body = queryResult.data
    }

    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(req.params)
      if (!paramsResult.success) {
        const message = paramsResult.error.issues.map((issue) => issue.message).join('\n')
        return res.status(400).json({
          code: 1,
          message: message || MESSAGE.INVALID_PARAMS,
        })
      }
      req.body = paramsResult.data
    }
    next()
  }
