import { MESSAGE } from '@/constants'
import redis from '@/utils/redis.util'
import { NextFunction, Request, Response } from 'express'

const WINDOW_SECONDS = 60
const MAX_REQUESTS = 60

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip
    const key = `rate-limit:${ip}`

    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS)
    }

    if (count > MAX_REQUESTS) {
      return res.status(429).json({
        code: 1,
        message: MESSAGE.RATE_LIMIT_EXCEEDED,
      })
    }

    next()
  } catch (err) {
    console.error('Rate limiter error:', err)
    next()
  }
}
