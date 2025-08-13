import { MESSAGE } from '@/constants'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod/v4'
import { ParamsDictionary } from 'express-serve-static-core'

type SchemaGroup = {
  body?: z.ZodSchema
  query?: z.ZodSchema
  params?: z.ZodSchema
}

export const validatorMiddleware =
  (schemas: SchemaGroup) => (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body)
      if (!bodyResult.success) {
        return res.status(400).json({
          code: 1,
          message: MESSAGE.INVALID_PARAMS,
        })
      }
      req.body = bodyResult.data
    }

    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query)
      if (!queryResult.success) {
        return res.status(400).json({
          code: 1,
          message: MESSAGE.INVALID_PARAMS,
        })
      }
      req.body = queryResult.data
    }

    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(req.params)
      if (!paramsResult.success) {
        return res.status(400).json({
          code: 1,
          message: MESSAGE.INVALID_PARAMS,
        })
      }
      req.params = paramsResult.data as ParamsDictionary
    }
    console.log(req.body)
    next()
  }
