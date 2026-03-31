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
  'videoAddDanmaku',
  'videoCreateOrUpdate',
  'videoDelete',
  'videoGetDanmakus',
  'videoGetDetail',
  'videoGetWatchLater',
  'videoList',
  'videoListLike',
  'videoListSpace',
  'videoShare',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'videoList',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/list',
    query: {
      page: 1,
      pageSize: 20,
    },
    usesValidation: true,
  },
  {
    controller: 'videoListSpace',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
        userId: 'user-1',
      },
    },
    method: 'get',
    path: '/list-space',
    query: {
      page: 1,
      pageSize: 20,
      userId: 'user-1',
    },
    usesValidation: true,
  },
  {
    body: {
      coverUrl: 'https://example.com/cover.png',
      title: 'Demo Video',
    },
    controller: 'videoCreateOrUpdate',
    expected: {
      body: {
        coverUrl: 'https://example.com/cover.png',
        title: 'Demo Video',
      },
    },
    method: 'post',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      coverUrl: 'https://example.com/cover.png',
      title: 'Updated Video',
    },
    controller: 'videoCreateOrUpdate',
    expected: {
      body: {
        coverUrl: 'https://example.com/cover.png',
        title: 'Updated Video',
      },
      params: { videoId: 'video-1' },
    },
    method: 'put',
    path: '/video-1',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'videoGetDanmakus',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'get',
    path: '/danmakus/video-1',
    usesValidation: true,
  },
  {
    body: {
      content: '2333',
      currentTime: 12,
      videoId: 'video-1',
    },
    controller: 'videoAddDanmaku',
    expected: {
      body: {
        content: '2333',
        currentTime: 12,
        videoId: 'video-1',
      },
    },
    method: 'post',
    path: '/danmakus',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'videoGetWatchLater',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/watch-later',
    query: {
      page: 1,
      pageSize: 20,
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'videoGetDetail',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'get',
    path: '/detail/video-1',
    requiresAuth: true,
  },
  {
    body: {
      platform: 'wechat',
      videoId: 'video-1',
    },
    controller: 'videoShare',
    expected: {
      body: {
        platform: 'wechat',
        videoId: 'video-1',
      },
    },
    method: 'post',
    path: '/share',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'videoListLike',
    expected: {
      params: { userId: 'user-1' },
    },
    method: 'get',
    path: '/list-like/user-1',
  },
  {
    controller: 'videoDelete',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'delete',
    path: '/video-1',
    requiresAuth: true,
  },
]

describe('videoRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/video.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: videoRoute } = await import('@/routes/video.route')
    app = createRouteApp(videoRoute)
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
