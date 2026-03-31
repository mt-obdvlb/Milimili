import type { Request, Response } from 'express'
import { beforeAll, beforeEach, describe, vi } from 'vitest'
import {
  assertRouteContract,
  createControllerMocks,
  createRouteApp,
  createUtilsMockModule,
  type RouteContractCase,
} from '@/__test__/utils/route-contract.utils'

const controllerMocks = createControllerMocks(['authRefresh', 'authSendCode'] as const)

const validatorMiddleware = vi.fn(() => (req: Request, res: Response, next: () => void) => {
  if (req.header('x-test-validation') === 'fail') {
    return res.status(400).json({
      code: 1,
      message: 'mock validation blocked',
    })
  }

  next()
})

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'authRefresh',
    method: 'post',
    path: '/refresh',
  },
  {
    body: {
      email: 'user@example.com',
    },
    controller: 'authSendCode',
    expected: {
      body: {
        email: 'user@example.com',
      },
    },
    method: 'post',
    path: '/send-code',
    usesValidation: true,
  },
]

describe('authRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/controllers/auth.controller', () => controllerMocks)
    vi.doMock('@/middlewares', () => ({
      validatorMiddleware,
    }))
    vi.doMock('@/utils', createUtilsMockModule)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: authRoute } = await import('@/routes/auth.route')
    app = createRouteApp(authRoute)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  assertRouteContract({
    cases,
    controllerMocks,
    getApp: () => app,
  })
})
