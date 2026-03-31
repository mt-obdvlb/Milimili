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
const controllerMocks = createControllerMocks(['comment', 'commentDelete', 'commentGet'] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    body: {
      content: 'nice video',
      parentId: null,
      rootId: 'root-1',
      videoId: 'video-1',
    },
    controller: 'comment',
    expected: {
      body: {
        content: 'nice video',
        parentId: null,
        rootId: 'root-1',
        videoId: 'video-1',
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'commentGet',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
        videoId: 'video-1',
      },
    },
    method: 'get',
    path: '/',
    query: {
      page: 1,
      pageSize: 20,
      videoId: 'video-1',
    },
    usesValidation: true,
  },
  {
    controller: 'commentDelete',
    expected: {
      params: { id: 'comment-1' },
    },
    method: 'delete',
    path: '/comment-1',
    requiresAuth: true,
    usesValidation: true,
  },
]

describe('commentRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: commentRoute } = await import('@/routes/comment.route')
    app = createRouteApp(commentRoute)
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
