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
  'userAtList',
  'userFindPassword',
  'userGetByEmail',
  'userGetById',
  'userGetByName',
  'userGetInfo',
  'userGetInfoHome',
  'userLogin',
  'userLogout',
  'userUpdateInfo',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    body: {
      email: 'user@example.com',
      password: 'password123',
    },
    controller: 'userLogin',
    expected: {
      body: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
    method: 'post',
    path: '/login',
    usesValidation: true,
  },
  {
    controller: 'userLogout',
    method: 'post',
    path: '/logout',
    requiresAuth: true,
  },
  {
    controller: 'userGetInfoHome',
    method: 'get',
    path: '/info/home',
    requiresAuth: true,
  },
  {
    controller: 'userGetInfo',
    method: 'get',
    path: '/info',
    requiresAuth: true,
  },
  {
    controller: 'userGetByEmail',
    expected: {
      query: {
        email: 'user@example.com',
      },
    },
    method: 'get',
    path: '/email',
    query: {
      email: 'user@example.com',
    },
    usesValidation: true,
  },
  {
    body: {
      code: '123456',
      email: 'user@example.com',
      password: 'new-password',
    },
    controller: 'userFindPassword',
    expected: {
      body: {
        code: '123456',
        email: 'user@example.com',
        password: 'new-password',
      },
    },
    method: 'put',
    path: '/find-password',
    usesValidation: true,
  },
  {
    controller: 'userGetByName',
    expected: {
      query: {
        name: 'milimili',
      },
    },
    method: 'get',
    path: '/name',
    query: {
      name: 'milimili',
    },
    usesValidation: true,
  },
  {
    controller: 'userAtList',
    expected: {
      query: {
        kw: 'mi',
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/at',
    query: {
      kw: 'mi',
      page: 1,
      pageSize: 20,
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      avatar: 'https://example.com/avatar.png',
      desc: 'updated profile',
      name: 'milimili',
    },
    controller: 'userUpdateInfo',
    expected: {
      body: {
        avatar: 'https://example.com/avatar.png',
        desc: 'updated profile',
        name: 'milimili',
      },
    },
    method: 'put',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'userGetById',
    expected: {
      params: { id: 'user-1' },
    },
    method: 'get',
    path: '/id/user-1',
  },
]

describe('userRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/user.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: userRoute } = await import('@/routes/user.route')
    app = createRouteApp(userRoute)
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
