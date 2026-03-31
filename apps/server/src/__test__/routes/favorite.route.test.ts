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
  'favoriteAddBatch',
  'favoriteCleanWatchLater',
  'favoriteDeleteBatch',
  'favoriteDetailGetByFolderId',
  'favoriteFolderAdd',
  'favoriteFolderDelete',
  'favoriteFolderList',
  'favoriteFolderUpdate',
  'favoriteGetByVideoId',
  'favoriteIsWatchLater',
  'favoriteList',
  'favoriteMoveBatch',
  'favoriteRecent',
  'favoriteWatchLaterAddOrDelete',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'favoriteFolderList',
    method: 'get',
    path: '/folder',
    requiresAuth: true,
  },
  {
    controller: 'favoriteFolderList',
    expected: {
      params: { userId: 'user-2' },
    },
    method: 'get',
    path: '/folder/user-2',
  },
  {
    controller: 'favoriteList',
    expected: {
      query: {
        folderId: 'folder-1',
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/',
    query: {
      folderId: 'folder-1',
      page: 1,
      pageSize: 20,
    },
    usesValidation: true,
  },
  {
    controller: 'favoriteRecent',
    method: 'get',
    path: '/recent',
    requiresAuth: true,
  },
  {
    controller: 'favoriteDetailGetByFolderId',
    expected: {
      params: { folderId: 'folder-1' },
    },
    method: 'get',
    path: '/detail/folder-1',
  },
  {
    body: {
      folderIds: ['folder-1'],
      videoIds: ['video-1'],
    },
    controller: 'favoriteAddBatch',
    expected: {
      body: {
        folderIds: ['folder-1'],
        videoIds: ['video-1'],
      },
    },
    method: 'post',
    path: '/batch',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      folderIds: ['folder-1'],
      videoIds: ['video-1'],
    },
    controller: 'favoriteDeleteBatch',
    expected: {
      body: {
        folderIds: ['folder-1'],
        videoIds: ['video-1'],
      },
    },
    method: 'delete',
    path: '/',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'favoriteCleanWatchLater',
    method: 'post',
    path: '/clean-watch-later',
    requiresAuth: true,
  },
  {
    body: {
      sourceFolderId: 'folder-1',
      targetFolderId: 'folder-2',
      videoIds: ['video-1'],
    },
    controller: 'favoriteMoveBatch',
    expected: {
      body: {
        sourceFolderId: 'folder-1',
        targetFolderId: 'folder-2',
        videoIds: ['video-1'],
      },
    },
    method: 'post',
    path: '/move-batch',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      desc: 'all-time favorites',
      name: 'My Folder',
      privacy: 0,
    },
    controller: 'favoriteFolderAdd',
    expected: {
      body: {
        desc: 'all-time favorites',
        name: 'My Folder',
        privacy: 0,
      },
    },
    method: 'post',
    path: '/folder',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'favoriteGetByVideoId',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'get',
    path: '/videoId/video-1',
    requiresAuth: true,
  },
  {
    controller: 'favoriteFolderDelete',
    expected: {
      params: { folderId: 'folder-1' },
    },
    method: 'delete',
    path: '/folder/folder-1',
    requiresAuth: true,
  },
  {
    body: {
      desc: 'updated folder',
      name: 'Updated Folder',
      privacy: 1,
    },
    controller: 'favoriteFolderUpdate',
    expected: {
      body: {
        desc: 'updated folder',
        name: 'Updated Folder',
        privacy: 1,
      },
      params: { folderId: 'folder-1' },
    },
    method: 'put',
    path: '/folder/folder-1',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'favoriteWatchLaterAddOrDelete',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'put',
    path: '/watch-later/video-1',
    requiresAuth: true,
  },
  {
    controller: 'favoriteIsWatchLater',
    expected: {
      params: { videoId: 'video-1' },
    },
    method: 'get',
    path: '/watch-later/video-1',
    requiresAuth: true,
  },
]

describe('favoriteRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers/favorite.controller', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: favoriteRoute } = await import('@/routes/favorite.route')
    app = createRouteApp(favoriteRoute)
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
