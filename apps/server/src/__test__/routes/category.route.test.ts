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
  'categoryCreate',
  'categoryGetAll',
  'categoryGetById',
  'categoryGetByName',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'categoryGetAll',
    method: 'get',
    path: '/',
  },
  {
    body: { name: 'Music' },
    controller: 'categoryCreate',
    expected: {
      body: { name: 'Music' },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
  },
  {
    controller: 'categoryGetByName',
    expected: {
      query: { name: 'Music' },
    },
    method: 'get',
    path: '/name',
    query: { name: 'Music' },
    usesValidation: true,
  },
  {
    controller: 'categoryGetById',
    expected: {
      params: { id: 'cat-1' },
    },
    method: 'get',
    path: '/id/cat-1',
    usesValidation: true,
  },
]

describe('categoryRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/category.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: categoryRoute } = await import('@/routes/category.route')
    app = createRouteApp(categoryRoute)
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
