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
  'searchLogAdd',
  'searchLogGet',
  'searchLogTop10',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    body: {
      keyword: 'milimili',
    },
    controller: 'searchLogAdd',
    expected: {
      body: {
        keyword: 'milimili',
      },
    },
    method: 'post',
    path: '/',
    usesValidation: true,
  },
  {
    controller: 'searchLogTop10',
    method: 'get',
    path: '/top10',
  },
  {
    controller: 'searchLogGet',
    expected: {
      query: {
        page: '1',
        pageSize: '10',
      },
    },
    method: 'get',
    path: '/',
    query: {
      page: 1,
      pageSize: 10,
    },
    usesValidation: true,
  },
]

describe('searchLogRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/search-log.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: searchLogRoute } = await import('@/routes/search-log.route')
    app = createRouteApp(searchLogRoute)
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
