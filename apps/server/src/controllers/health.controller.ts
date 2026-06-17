import mongoose from 'mongoose'
import { RequestHandler } from 'express'
import redis from '@/utils/redis.util'

type HealthDependencyStatus = 'ok' | 'error'

interface ReadyResponse {
  code: 0 | 1
  data: {
    status: 'ok' | 'degraded'
    dependencies: {
      mongo: HealthDependencyStatus
      redis: HealthDependencyStatus
    }
    timestamp: string
  }
}

const pingRedis = async () => {
  const timeout = new Promise<false>((resolve) => {
    setTimeout(() => resolve(false), 500)
  })
  const ping = redis.ping().then((result) => result === 'PONG')
  return Promise.race([ping, timeout])
}

export const healthz: RequestHandler = (_req, res) => {
  res.status(200).json({
    code: 0,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  })
}

export const readyz: RequestHandler = async (_req, res) => {
  const mongoOk = mongoose.connection.readyState === 1
  const redisOk = await pingRedis().catch(() => false)
  const ready = mongoOk && redisOk

  const response: ReadyResponse = {
    code: ready ? 0 : 1,
    data: {
      status: ready ? 'ok' : 'degraded',
      dependencies: {
        mongo: mongoOk ? 'ok' : 'error',
        redis: redisOk ? 'ok' : 'error',
      },
      timestamp: new Date().toISOString(),
    },
  }

  res.status(ready ? 200 : 503).json(response)
}
