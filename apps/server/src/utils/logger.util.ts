import pino from 'pino'
import pinoHttp from 'pino-http'
import { randomUUID } from 'crypto'
import { env, isProduction } from '@/config'

export const logger = pino({
  level: process.env.VITEST ? 'silent' : env.LOG_LEVEL,
  base: {
    service: env.OTEL_SERVICE_NAME,
    environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    remove: true,
  },
})

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const header = req.headers['x-request-id']
    return Array.isArray(header) ? header[0] || randomUUID() : header || randomUUID()
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return isProduction ? 'info' : 'debug'
  },
})
