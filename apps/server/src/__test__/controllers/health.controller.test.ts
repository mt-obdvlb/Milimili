import { describe, expect, it, vi } from 'vitest'
import { Request, Response } from 'express'
import { healthz, readyz } from '@/controllers/health.controller'

const redisMocks = vi.hoisted(() => ({
  ping: vi.fn(),
}))

const mongooseMocks = vi.hoisted(() => ({
  connection: {
    readyState: 1,
  },
}))

vi.mock('@/utils/redis.util', () => ({
  default: redisMocks,
}))

vi.mock('mongoose', () => ({
  default: mongooseMocks,
}))

const createHttpMocks = () => {
  let statusCode = 200
  let body: unknown
  const res = {
    status: vi.fn((code: number) => {
      statusCode = code
      return res
    }),
    json: vi.fn((value: unknown) => {
      body = value
      return res
    }),
  } as unknown as Response

  return {
    req: {} as Request,
    res,
    get statusCode() {
      return statusCode
    },
    get body() {
      return body
    },
  }
}

describe('health controller', () => {
  it('returns liveness status', async () => {
    const http = createHttpMocks()

    healthz(http.req, http.res, vi.fn())

    expect(http.statusCode).toBe(200)
    expect(http.body).toMatchObject({
      code: 0,
      data: { status: 'ok' },
    })
  })

  it('returns ready when dependencies are healthy', async () => {
    const http = createHttpMocks()
    mongooseMocks.connection.readyState = 1
    redisMocks.ping.mockResolvedValueOnce('PONG')

    await readyz(http.req, http.res, vi.fn())

    expect(http.statusCode).toBe(200)
    expect(http.body).toMatchObject({
      code: 0,
      data: {
        status: 'ok',
        dependencies: {
          mongo: 'ok',
          redis: 'ok',
        },
      },
    })
  })

  it('returns degraded when a dependency is unhealthy', async () => {
    const http = createHttpMocks()
    mongooseMocks.connection.readyState = 0
    redisMocks.ping.mockRejectedValueOnce(new Error('redis unavailable'))

    await readyz(http.req, http.res, vi.fn())

    expect(http.statusCode).toBe(503)
    expect(http.body).toMatchObject({
      code: 1,
      data: {
        status: 'degraded',
        dependencies: {
          mongo: 'error',
          redis: 'error',
        },
      },
    })
  })
})
