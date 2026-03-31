import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/auth.service', () => ({
  AuthService: {
    refreshToken: vi.fn(),
    sendCode: vi.fn(),
  },
}))

vi.mock('@/services/favorite.service', () => ({
  FavoriteService: {
    addBatch: vi.fn(),
    cleanWatchLater: vi.fn(),
    detailByFolderId: vi.fn(),
    folderAdd: vi.fn(),
    folderDelete: vi.fn(),
    folderUpdate: vi.fn(),
    get: vi.fn(),
    isWatchLater: vi.fn(),
    listFolder: vi.fn(),
    listRecent: vi.fn(),
    moveBatch: vi.fn(),
    watchLaterAddOrDelete: vi.fn(),
  },
}))

import { MESSAGE } from '@/constants'
import { authRefresh, authSendCode } from '@/controllers/auth.controller'
import {
  favoriteAddBatch,
  favoriteCleanWatchLater,
  favoriteDetailGetByFolderId,
  favoriteFolderAdd,
  favoriteFolderDelete,
  favoriteFolderList,
  favoriteFolderUpdate,
  favoriteGetByVideoId,
  favoriteIsWatchLater,
  favoriteRecent,
  favoriteWatchLaterAddOrDelete,
} from '@/controllers/favorite.controller'
import { AuthService } from '@/services/auth.service'
import { FavoriteService } from '@/services/favorite.service'

describe('auth/favorite controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('authRefresh returns 401 when refresh_token cookie is missing', async () => {
    const res = createMockResponse()

    await authRefresh(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: MESSAGE.INVALID_TOKEN,
    })
  })

  it('authRefresh returns the original refresh token while setting rotated cookies', async () => {
    vi.mocked(AuthService.refreshToken).mockResolvedValue({
      accessToken: 'next-access',
      newRefreshToken: 'next-refresh',
    } as never)

    const res = createMockResponse()

    await authRefresh(
      createMockRequest({
        cookies: {
          refresh_token: 'stale-refresh',
        },
      }),
      res,
      vi.fn()
    )

    expect(AuthService.refreshToken).toHaveBeenCalledWith('stale-refresh')
    expect(res.cookie).toHaveBeenCalledTimes(2)
    expect(res.json).toHaveBeenCalledWith({
      code: 0,
      data: {
        accessToken: 'next-access',
        refreshToken: 'stale-refresh',
      },
    })
  })

  it('authSendCode delegates to AuthService.sendCode', async () => {
    const res = createMockResponse()

    await authSendCode(
      createMockRequest({
        body: {
          email: 'user@example.com',
        },
      }),
      res,
      vi.fn()
    )

    expect(AuthService.sendCode).toHaveBeenCalledWith('user@example.com')
    expect(res.json).toHaveBeenCalledWith({ code: 0 })
  })

  it('favoriteFolderList prefers params.userId and falls back to req.user.id', async () => {
    vi.mocked(FavoriteService.listFolder).mockResolvedValue([] as never)

    const res = createMockResponse()

    await favoriteFolderList(
      createMockRequest({
        params: { userId: 'user-from-params' },
        user: { id: 'user-from-auth' },
      }),
      res,
      vi.fn()
    )

    await favoriteFolderList(
      createMockRequest({
        user: { id: 'user-from-auth' },
      }),
      res,
      vi.fn()
    )

    expect(FavoriteService.listFolder).toHaveBeenNthCalledWith(1, 'user-from-params')
    expect(FavoriteService.listFolder).toHaveBeenNthCalledWith(2, 'user-from-auth')
  })

  it('favoriteFolderList returns auth error when both params and user are missing', async () => {
    const res = createMockResponse()

    await favoriteFolderList(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  })

  it('favoriteRecent and favoriteCleanWatchLater require req.user.id', async () => {
    const res = createMockResponse()

    await favoriteRecent(createMockRequest(), res, vi.fn())
    await favoriteCleanWatchLater(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenNthCalledWith(1, 401)
    expect(res.status).toHaveBeenNthCalledWith(2, 401)
  })

  it('favorite mutations delegate using current request body and params shape', async () => {
    const res = createMockResponse()

    await favoriteAddBatch(
      createMockRequest({
        body: { folderIds: ['folder-1'], videoIds: ['video-1'] },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteFolderAdd(
      createMockRequest({
        body: { name: '收藏夹' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteFolderUpdate(
      createMockRequest({
        body: { name: '新收藏夹' },
        params: { folderId: 'folder-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteFolderDelete(
      createMockRequest({
        params: { folderId: 'folder-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteWatchLaterAddOrDelete(
      createMockRequest({
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FavoriteService.addBatch).toHaveBeenCalledWith(
      { folderIds: ['folder-1'], videoIds: ['video-1'] },
      'user-1'
    )
    expect(FavoriteService.folderAdd).toHaveBeenCalledWith({ name: '收藏夹' }, 'user-1')
    expect(FavoriteService.folderUpdate).toHaveBeenCalledWith('user-1', 'folder-1', {
      name: '新收藏夹',
    })
    expect(FavoriteService.folderDelete).toHaveBeenCalledWith('user-1', 'folder-1')
    expect(FavoriteService.watchLaterAddOrDelete).toHaveBeenCalledWith('user-1', 'video-1')
  })

  it('favorite detail and status getters use params ids', async () => {
    vi.mocked(FavoriteService.detailByFolderId).mockResolvedValue({ id: 'folder-1' } as never)
    vi.mocked(FavoriteService.get).mockResolvedValue(0 as never)
    vi.mocked(FavoriteService.isWatchLater).mockResolvedValue(0 as never)

    const res = createMockResponse()

    await favoriteDetailGetByFolderId(
      createMockRequest({
        params: { folderId: 'folder-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteGetByVideoId(
      createMockRequest({
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await favoriteIsWatchLater(
      createMockRequest({
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FavoriteService.detailByFolderId).toHaveBeenCalledWith('folder-1')
    expect(FavoriteService.get).toHaveBeenCalledWith('video-1', 'user-1')
    expect(FavoriteService.isWatchLater).toHaveBeenCalledWith('user-1', 'video-1')
  })

  it('favoriteGetByVideoId returns its current auth-error payload when user is missing', async () => {
    const res = createMockResponse()

    await favoriteGetByVideoId(
      createMockRequest({
        params: { videoId: 'video-1' },
      }),
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      message: MESSAGE.AUTH_ERROR,
    })
  })
})
