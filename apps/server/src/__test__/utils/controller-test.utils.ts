import type { Request, Response } from 'express'
import { vi } from 'vitest'

export const createMockRequest = (overrides: Partial<Request> = {}) =>
  ({
    body: {},
    cookies: {},
    params: {},
    query: {},
    ...overrides,
  }) as unknown as Request

export const createMockResponse = () => {
  const response = {
    clearCookie: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
  }

  return response as unknown as Response
}
