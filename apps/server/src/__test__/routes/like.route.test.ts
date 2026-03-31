import { beforeAll, beforeEach, describe, vi } from 'vitest'
import {
  assertRouteContract,
  createControllerMocks,
  createMiddlewareMocks,
  createRouteApp,
  createUtilsMockModule,
  type RouteContractCase,
} from '@/__test__/utils/route-contract.utils'

const middlewareMocks = createMiddlewareMocks()
const controllerMocks = createControllerMocks(['like', 'likeGet', 'unlike'] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'likeGet',
    expected: {
      query: {
        bizId: 'video-1',
        bizType: 'video',
      },
    },
    method: 'get',
    path: '/',
    query: {
      bizId: 'video-1',
      bizType: 'video',
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      bizId: 'video-1',
      bizType: 'video',
    },
    controller: 'like',
    expected: {
      body: {
        bizId: 'video-1',
        bizType: 'video',
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'unlike',
    expected: {
      query: {
        bizId: 'video-1',
        bizType: 'video',
      },
    },
    method: 'delete',
    path: '/',
    query: {
      bizId: 'video-1',
      bizType: 'video',
    },
    requiresAuth: true,
    usesValidation: true,
  },
]

describe('likeRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: likeRoute } = await import('@/routes/like.route')
    app = createRouteApp(likeRoute)
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
