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
const controllerMocks = createControllerMocks([
  'followCreate',
  'followDelete',
  'followGet',
  'followList',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'followGet',
    expected: {
      query: { followingId: 'user-2' },
    },
    method: 'get',
    path: '/',
    query: {
      followingId: 'user-2',
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      followingId: 'user-2',
    },
    controller: 'followCreate',
    expected: {
      body: {
        followingId: 'user-2',
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      followingId: 'user-2',
    },
    controller: 'followDelete',
    expected: {
      body: {
        followingId: 'user-2',
      },
    },
    method: 'delete',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'followList',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
        userId: 'user-2',
      },
    },
    method: 'get',
    path: '/list',
    query: {
      page: 1,
      pageSize: 20,
      userId: 'user-2',
    },
    usesValidation: true,
  },
]

describe('followRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/follow.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: followRoute } = await import('@/routes/follow.route')
    app = createRouteApp(followRoute)
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
