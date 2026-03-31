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
  'historyAdd',
  'historyClearUp',
  'historyDeleteBatch',
  'historyGet',
  'historyList',
  'historyRecent',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'historyList',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/',
    query: {
      page: 1,
      pageSize: 20,
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'historyRecent',
    method: 'get',
    path: '/recent',
    requiresAuth: true,
  },
  {
    body: {
      currentTime: 88,
      videoId: 'video-1',
    },
    controller: 'historyAdd',
    expected: {
      body: {
        currentTime: 88,
        videoId: 'video-1',
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      videoIds: ['video-1', 'video-2'],
    },
    controller: 'historyDeleteBatch',
    expected: {
      body: {
        videoIds: ['video-1', 'video-2'],
      },
    },
    method: 'post',
    path: '/delete',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'historyClearUp',
    method: 'delete',
    path: '/clear',
    requiresAuth: true,
  },
  {
    controller: 'historyGet',
    expected: {
      query: {
        videoId: 'video-1',
      },
    },
    method: 'get',
    path: '/list',
    query: {
      videoId: 'video-1',
    },
    requiresAuth: true,
    usesValidation: true,
  },
]

describe('historyRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/history.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: historyRoute } = await import('@/routes/history.route')
    app = createRouteApp(historyRoute)
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
