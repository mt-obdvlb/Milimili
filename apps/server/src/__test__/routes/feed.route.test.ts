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
  'feedCreate',
  'feedDelete',
  'feedFollowingList',
  'feedGetById',
  'feedList',
  'feedListLikeTranspont',
  'feedRecent',
  'feedTranspont',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'feedRecent',
    method: 'get',
    path: '/recent',
    requiresAuth: true,
  },
  {
    controller: 'feedFollowingList',
    method: 'get',
    path: '/following',
    requiresAuth: true,
  },
  {
    body: {
      content: 'new feed',
      images: [],
    },
    controller: 'feedCreate',
    expected: {
      body: {
        content: 'new feed',
        images: [],
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'feedList',
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
    controller: 'feedDelete',
    expected: {
      params: { id: 'feed-1' },
    },
    method: 'delete',
    path: '/feed-1',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'feedGetById',
    expected: {
      params: { id: 'feed-1' },
    },
    method: 'get',
    path: '/feed-1',
    usesValidation: true,
  },
  {
    body: {
      feedId: 'feed-1',
    },
    controller: 'feedTranspont',
    expected: {
      body: {
        feedId: 'feed-1',
      },
    },
    method: 'post',
    path: '/transpont',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'feedListLikeTranspont',
    expected: {
      params: { id: 'feed-1' },
      query: {
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/feed-1/like-transpont',
    query: {
      page: 1,
      pageSize: 20,
    },
    usesValidation: true,
  },
]

describe('feedRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: feedRoute } = await import('@/routes/feed.route')
    app = createRouteApp(feedRoute)
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
