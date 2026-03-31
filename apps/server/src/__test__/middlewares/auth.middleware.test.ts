import type { NextFunction, Request, Response } from 'express'
import { beforeAll, describe, expect, it, vi } from 'vitest'

let authMiddleware: (req: Request, res: Response, next: NextFunction) => unknown
let verifyToken: ReturnType<typeof vi.fn>

const createResponse = () => {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }

  return response as unknown as Response
}

describe('authMiddleware', () => {
  beforeAll(async () => {
    vi.resetModules()
    verifyToken = vi.fn()
    vi.doMock('@/utils', () => ({
      verifyToken,
    }))
    vi.doMock('@/utils/jwt.util', () => ({
      verifyToken,
    }))

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    ;({ authMiddleware } = await import('@/middlewares/auth.middleware'))
  })

  it('returns 401 when cookies are missing', async () => {
    const req = {} as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: '请先登录',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when access_token is missing', async () => {
    const req = { cookies: {} } as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: '请先登录',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token verification fails', async () => {
    verifyToken.mockImplementation(() => {
      throw new Error('expired')
    })

    const req = { cookies: { access_token: 'stale-token' } } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: '登录信息已过期，请重新登录',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('attaches the decoded user and calls next for a valid token', async () => {
    verifyToken.mockReturnValue({
      id: 'user-1',
      iat: 1,
      exp: 2,
    })

    const req = { cookies: { access_token: 'valid-token' } } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(req.user).toEqual({
      id: 'user-1',
      iat: 1,
      exp: 2,
    })
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })
})
