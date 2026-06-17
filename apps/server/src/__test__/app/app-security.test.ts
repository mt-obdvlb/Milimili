import request from 'supertest'
import { Express } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const redisMocks = vi.hoisted(() => ({
  expire: vi.fn(),
  incr: vi.fn(),
  on: vi.fn(),
  ping: vi.fn(),
}))

const createApp = async () => {
  vi.resetModules()
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('PORT', '3000')
  vi.stubEnv('FRONTEND_URL', 'https://www.mtobdvlb.icu')
  vi.stubEnv('SWAGGER_SERVER_URL', 'https://www.mtobdvlb.icu')
  vi.stubEnv('MONGO_URI', 'mongodb://127.0.0.1:27017/milimili-test')
  vi.stubEnv('JWT_SECRET', 'test-production-secret')
  vi.stubEnv('REDIS_URI', 'redis://127.0.0.1:6379')
  vi.stubEnv('EMAIL_USER', 'test@example.com')
  vi.stubEnv('EMAIL_PASS', 'test-email-pass')
  vi.stubEnv('OSS_REGION', 'oss-cn-beijing')
  vi.stubEnv('OSS_ACCESS_KEY_ID', 'test-access-key-id')
  vi.stubEnv('OSS_ACCESS_KEY_SECRET', 'test-access-key-secret')
  vi.stubEnv('OSS_BUCKET', 'test-bucket')

  redisMocks.incr.mockResolvedValue(1)
  redisMocks.expire.mockResolvedValue(1)

  vi.doMock('@/utils/redis.util', () => ({
    default: redisMocks,
  }))

  vi.doMock('@/routes', async () => {
    const { Router } = await import('express')
    const router = Router()
    router.get('/ping', (_req, res) => res.status(200).json({ code: 0 }))
    return { default: router }
  })

  const appModule = (await import('../../app.js')) as unknown as { default: Express }
  return appModule.default
}

describe('app security hardening', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('sets API security headers and hides framework headers', async () => {
    const app = await createApp()

    const response = await request(app).get('/api/v1/ping')

    expect(response.status).toBe(200)
    expect(response.headers['x-powered-by']).toBeUndefined()
    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['x-frame-options']).toBe('DENY')
    expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  })

  it('does not expose swagger in production by default', async () => {
    const app = await createApp()

    const response = await request(app).get('/api-docs')

    expect(response.status).toBe(404)
  })
})
