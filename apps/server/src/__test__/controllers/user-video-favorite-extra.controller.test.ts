import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/user.service', () => ({
  UserService: {
    findPassword: vi.fn(),
    getByName: vi.fn(),
    getInfo: vi.fn(),
    getInfoHome: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/services/video.service', () => ({
  VideoService: {
    addDanmaku: vi.fn(),
  },
}))

vi.mock('@/services/favorite.service', () => ({
  FavoriteService: {
    deleteBatch: vi.fn(),
    moveBatch: vi.fn(),
  },
}))

import { MESSAGE } from '@/constants'
import {
  userFindPassword,
  userGetByName,
  userGetInfo,
  userGetInfoHome,
  userUpdateInfo,
} from '@/controllers/user.controller'
import { videoAddDanmaku } from '@/controllers/video.controller'
import { favoriteDeleteBatch, favoriteMoveBatch } from '@/controllers/favorite.controller'
import { UserService } from '@/services/user.service'
import { VideoService } from '@/services/video.service'
import { FavoriteService } from '@/services/favorite.service'

describe('user/video/favorite extra controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('userGetInfoHome and userGetInfo require auth and delegate when present', async () => {
    vi.mocked(UserService.getInfoHome).mockResolvedValue({ id: 'user-1' } as never)
    vi.mocked(UserService.getInfo).mockResolvedValue({ id: 'user-1' } as never)

    const unauthorizedRes = createMockResponse()
    const authorizedRes = createMockResponse()

    await userGetInfoHome(createMockRequest(), unauthorizedRes, vi.fn())
    await userGetInfo(
      createMockRequest({
        user: { id: 'user-1' },
      }),
      authorizedRes,
      vi.fn()
    )

    expect(unauthorizedRes.status).toHaveBeenCalledWith(401)
    expect(unauthorizedRes.json).toHaveBeenCalledWith({
      code: 1,
      message: MESSAGE.INVALID_TOKEN,
    })
    expect(UserService.getInfo).toHaveBeenCalledWith('user-1')
  })

  it('userFindPassword, userGetByName, and userUpdateInfo follow current request fields', async () => {
    vi.mocked(UserService.getByName).mockResolvedValue({ list: [] } as never)

    const res = createMockResponse()

    await userFindPassword(
      createMockRequest({
        body: {
          code: '123456',
          email: 'user@example.com',
          password: 'new-password',
        },
      }),
      res,
      vi.fn()
    )

    await userGetByName(
      createMockRequest({
        query: { name: 'milimili' },
      }),
      res,
      vi.fn()
    )

    await userUpdateInfo(
      createMockRequest({
        body: { name: 'milimili' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(UserService.findPassword).toHaveBeenCalledWith({
      code: '123456',
      email: 'user@example.com',
      password: 'new-password',
    })
    expect(UserService.getByName).toHaveBeenCalledWith('milimili')
    expect(UserService.update).toHaveBeenCalledWith('user-1', { name: 'milimili' })
  })

  it('userUpdateInfo returns invalid-token payload when user is missing', async () => {
    const res = createMockResponse()

    await userUpdateInfo(createMockRequest({ body: { name: 'milimili' } }), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: MESSAGE.INVALID_TOKEN,
    })
  })

  it('videoAddDanmaku injects userId and returns service data', async () => {
    vi.mocked(VideoService.addDanmaku).mockResolvedValue({ id: 'danmaku-1' } as never)

    const res = createMockResponse()

    await videoAddDanmaku(
      createMockRequest({
        body: {
          content: '2333',
          currentTime: 12,
          videoId: 'video-1',
        },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(VideoService.addDanmaku).toHaveBeenCalledWith({
      content: '2333',
      currentTime: 12,
      userId: 'user-1',
      videoId: 'video-1',
    })
    expect(res.json).toHaveBeenCalledWith({
      code: 0,
      data: { id: 'danmaku-1' },
    })
  })

  it('videoAddDanmaku returns auth error without a user', async () => {
    const res = createMockResponse()

    await videoAddDanmaku(
      createMockRequest({
        body: { content: '2333', currentTime: 12, videoId: 'video-1' },
      }),
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  })

  it('favoriteDeleteBatch and favoriteMoveBatch require auth and delegate current body', async () => {
    const unauthorizedRes = createMockResponse()
    const authorizedRes = createMockResponse()

    await favoriteDeleteBatch(
      createMockRequest({
        body: { videoIds: ['video-1'] },
      }),
      unauthorizedRes,
      vi.fn()
    )

    await favoriteMoveBatch(
      createMockRequest({
        body: {
          sourceFolderId: 'folder-1',
          targetFolderId: 'folder-2',
          videoIds: ['video-1'],
        },
        user: { id: 'user-1' },
      }),
      authorizedRes,
      vi.fn()
    )

    expect(unauthorizedRes.status).toHaveBeenCalledWith(401)
    expect(FavoriteService.deleteBatch).not.toHaveBeenCalled()
    expect(FavoriteService.moveBatch).toHaveBeenCalledWith(
      {
        sourceFolderId: 'folder-1',
        targetFolderId: 'folder-2',
        videoIds: ['video-1'],
      },
      'user-1'
    )
  })
})
