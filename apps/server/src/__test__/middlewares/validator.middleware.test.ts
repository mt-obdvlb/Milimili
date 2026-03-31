import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod/v4'
import { describe, expect, it, vi } from 'vitest'
import { validatorMiddleware } from '@/middlewares/validator.middleware'

const createResponse = () => {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }

  return response as unknown as Response
}

describe('validatorMiddleware', () => {
  it('replaces req.body with the parsed body payload', () => {
    const middleware = validatorMiddleware({
      body: z.object({
        page: z.coerce.number().int(),
      }),
    })
    const req = {
      body: { page: '2' },
      query: {},
      params: {},
    } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(req.body).toEqual({ page: 2 })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('replaces req.query with the parsed query payload', () => {
    const middleware = validatorMiddleware({
      query: z.object({
        page: z.coerce.number().int(),
      }),
    })
    const req = {
      body: {},
      query: { page: '3' },
      params: {},
    } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(req.query).toEqual({ page: '3' })
    expect(req.body).toEqual({ page: 3 })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('replaces req.params with the parsed params payload', () => {
    const middleware = validatorMiddleware({
      params: z.object({
        id: z.string().min(1),
      }),
    })
    const req = {
      body: {},
      query: {},
      params: { id: 'video-1' },
    } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(req.params).toEqual({ id: 'video-1' })
    expect(req.body).toEqual({ id: 'video-1' })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when validation fails', () => {
    const middleware = validatorMiddleware({
      body: z.object({
        page: z.coerce.number().int(),
      }),
    })
    const req = {
      body: {},
      query: {},
      params: {},
    } as unknown as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: expect.stringContaining('Invalid input'),
    })
    expect(next).not.toHaveBeenCalled()
  })
})
