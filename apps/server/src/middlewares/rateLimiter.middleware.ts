import { MESSAGE } from '@/constants'
import { getAppConfig } from '@/config'
import redis from '@/utils/redis.util'
import { NextFunction, Request, Response } from 'express'

const appConfig = getAppConfig()
const WINDOW_SECONDS = appConfig.rateLimitWindowSeconds
const MAX_REQUESTS = appConfig.rateLimitMaxRequests

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
