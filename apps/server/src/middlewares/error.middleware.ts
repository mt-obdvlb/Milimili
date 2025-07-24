import { MESSAGE } from '@/constants'
import { ErrorRequestHandler, Request, Response } from 'express'

export const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500
  const message = err.message || MESSAGE.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({
    code: statusCode,
    message,
  })
}
