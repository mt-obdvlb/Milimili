import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/message.service', () => ({
  MessageService: {
    createConversation: vi.fn(),
    delete: vi.fn(),
    deleteConversation: vi.fn(),
    getConversation: vi.fn(),
    getList: vi.fn(),
    read: vi.fn(),
  },
}))

vi.mock('@/services/user.service', () => ({
  UserService: {
    getById: vi.fn(),
    getAtList: vi.fn(),
    getByEmail: vi.fn(),
    loginByCode: vi.fn(),
    loginByPassword: vi.fn(),
  },
}))

vi.mock('@/services/video.service', () => ({
  VideoService: {
    createOrUpdate: vi.fn(),
    delete: vi.fn(),
    getDetail: vi.fn(),
    getDanmakus: vi.fn(),
    getWatchLater: vi.fn(),
    listLike: vi.fn(),
    list: vi.fn(),
    listSpace: vi.fn(),
    share: vi.fn(),
  },
}))

import { MESSAGE } from '@/constants'
import {
  messageRead,
  messageCreateConversation,
  messageDelete,
  messageDeleteConversation,
  messageGetConversation,
  messageList,
} from '@/controllers/message.controller'
import {
  userAtList,
  userGetByEmail,
  userGetById,
  userLogin,
  userLogout,
} from '@/controllers/user.controller'
import {
  videoCreateOrUpdate,
  videoDelete,
  videoGetDetail,
  videoGetDanmakus,
  videoGetWatchLater,
  videoListLike,
  videoList,
  videoListSpace,
  videoShare,
} from '@/controllers/video.controller'
import { MessageService } from '@/services/message.service'
import { UserService } from '@/services/user.service'
import { VideoService } from '@/services/video.service'

describe('message/user/video controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('messageList reads req.body for pagination', async () => {
    vi.mocked(MessageService.getList).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { page: 1, pageSize: 20 }

    await messageList(
      createMockRequest({
        body,
        query: { page: '9' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(MessageService.getList).toHaveBeenCalledWith('user-1', body)
  })

  it('message conversation controllers read ids from req.body', async () => {
    vi.mocked(MessageService.getConversation).mockResolvedValue([] as never)

    const res = createMockResponse()

    await messageGetConversation(
      createMockRequest({
        body: { userId: 'wrong-id' },
        params: { userId: 'ignored-user-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await messageCreateConversation(
      createMockRequest({
        body: { userId: 'user-2' },
        params: { userId: 'ignored-user-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await messageDeleteConversation(
      createMockRequest({
        body: { conversationId: 'conversation-1' },
        params: { conversationId: 'ignored-conversation-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await messageDelete(
      createMockRequest({
        body: { id: 'message-1' },
        params: { id: 'ignored-message-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(MessageService.getConversation).toHaveBeenCalledWith('user-1', 'wrong-id')
    expect(MessageService.createConversation).toHaveBeenCalledWith('user-1', 'user-2')
    expect(MessageService.deleteConversation).toHaveBeenCalledWith('user-1', 'conversation-1')
    expect(MessageService.delete).toHaveBeenCalledWith('user-1', 'message-1')
  })

  it('messageList returns invalid token when user is missing', async () => {
    const res = createMockResponse()

    await messageList(createMockRequest({ query: { page: '1' } }), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 1,
      message: MESSAGE.INVALID_TOKEN,
    })
  })

  it('userGetByEmail and userAtList read the current request fields', async () => {
    vi.mocked(UserService.getByEmail).mockResolvedValue({ id: 'user-1' } as never)
    vi.mocked(UserService.getAtList).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()

    await userGetByEmail(
      createMockRequest({
        body: { email: 'user@example.com' },
        query: { email: 'wrong@example.com' },
      }),
      res,
      vi.fn()
    )

    await userAtList(
      createMockRequest({
        body: { kw: 'mi', page: 1, pageSize: 20 },
        query: { kw: 'wrong' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(UserService.getByEmail).toHaveBeenCalledWith('user@example.com')
    expect(UserService.getAtList).toHaveBeenCalledWith('user-1', {
      kw: 'mi',
      page: 1,
      pageSize: 20,
    })
  })

  it('video list controllers read req.body and danmaku detail reads req.body.videoId', async () => {
    vi.mocked(VideoService.list).mockResolvedValue([] as never)
    vi.mocked(VideoService.listSpace).mockResolvedValue({ list: [], total: 0 } as never)
    vi.mocked(VideoService.getWatchLater).mockResolvedValue({ list: [], total: 0 } as never)
    vi.mocked(VideoService.getDanmakus).mockResolvedValue([] as never)

    const res = createMockResponse()

    await videoList(
      createMockRequest({
        body: { page: 1, pageSize: 20 },
        query: { page: '9' },
      }),
      res,
      vi.fn()
    )

    await videoListSpace(
      createMockRequest({
        body: { page: 1, pageSize: 20, userId: 'user-1' },
        query: { page: '9' },
      }),
      res,
      vi.fn()
    )

    await videoGetWatchLater(
      createMockRequest({
        body: { page: 1, pageSize: 20 },
        query: { page: '9' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoGetDanmakus(
      createMockRequest({
        body: { videoId: 'video-1' },
        params: { videoId: 'wrong-id' },
      }),
      res,
      vi.fn()
    )

    expect(VideoService.list).toHaveBeenCalledWith({ page: 1, pageSize: 20 })
    expect(VideoService.listSpace).toHaveBeenCalledWith({ page: 1, pageSize: 20, userId: 'user-1' })
    expect(VideoService.getWatchLater).toHaveBeenCalledWith({ page: 1, pageSize: 20 }, 'user-1')
    expect(VideoService.getDanmakus).toHaveBeenCalledWith('video-1')
  })

  it('videoGetDanmakus returns 400 when body.videoId is missing', async () => {
    const res = createMockResponse()

    await videoGetDanmakus(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(400)
    expect(VideoService.getDanmakus).not.toHaveBeenCalled()
  })

  it('messageRead passes body.type and params.id to MessageService.read', async () => {
    const res = createMockResponse()

    await messageRead(
      createMockRequest({
        body: { type: 'single' },
        params: { id: 'message-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(MessageService.read).toHaveBeenCalledWith('user-1', 'single', 'message-1')
  })

  it('userLogin sets cookies for password and code login flows, and userLogout clears them', async () => {
    vi.mocked(UserService.loginByPassword).mockResolvedValue({
      accessToken: 'access-password',
      refreshToken: 'refresh-password',
    } as never)
    vi.mocked(UserService.loginByCode).mockResolvedValue({
      accessToken: 'access-code',
      refreshToken: 'refresh-code',
    } as never)

    const passwordRes = createMockResponse()
    const codeRes = createMockResponse()
    const logoutRes = createMockResponse()

    await userLogin(
      createMockRequest({
        body: {
          email: 'user@example.com',
          password: 'password123',
        },
      }),
      passwordRes,
      vi.fn()
    )

    await userLogin(
      createMockRequest({
        body: {
          code: '123456',
          email: 'user@example.com',
        },
      }),
      codeRes,
      vi.fn()
    )

    await userLogout(createMockRequest(), logoutRes, vi.fn())

    expect(UserService.loginByPassword).toHaveBeenCalledWith('user@example.com', 'password123')
    expect(UserService.loginByCode).toHaveBeenCalledWith('user@example.com', '123456')
    expect(passwordRes.cookie).toHaveBeenCalledTimes(2)
    expect(codeRes.cookie).toHaveBeenCalledTimes(2)
    expect(logoutRes.clearCookie).toHaveBeenCalledTimes(2)
  })

  it('userGetById uses params.id and video detail/share/delete keep current param-body split', async () => {
    vi.mocked(UserService.getById).mockResolvedValue({ id: 'user-1' } as never)
    vi.mocked(VideoService.getDetail).mockResolvedValue({ id: 'video-1' } as never)

    const res = createMockResponse()

    await userGetById(
      createMockRequest({
        params: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoGetDetail(
      createMockRequest({
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoShare(
      createMockRequest({
        body: { platform: 'wechat', videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoDelete(
      createMockRequest({
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoListLike(
      createMockRequest({
        params: { userId: 'user-2' },
      }),
      res,
      vi.fn()
    )

    expect(UserService.getById).toHaveBeenCalledWith('user-1')
    expect(VideoService.getDetail).toHaveBeenCalledWith('video-1', 'user-1')
    expect(VideoService.share).toHaveBeenCalledWith('user-1', {
      platform: 'wechat',
      videoId: 'video-1',
    })
    expect(VideoService.delete).toHaveBeenCalledWith('video-1', 'user-1')
    expect(VideoService.listLike).toHaveBeenCalledWith('user-2')
  })

  it('videoCreateOrUpdate rejects missing user and array params, otherwise delegates to service', async () => {
    const res = createMockResponse()

    await videoCreateOrUpdate(
      createMockRequest({
        body: { title: 'Demo Video' },
      }),
      res,
      vi.fn()
    )

    await videoCreateOrUpdate(
      createMockRequest({
        body: { title: 'Demo Video' },
        params: { videoId: ['video-1'] as unknown as string },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await videoCreateOrUpdate(
      createMockRequest({
        body: { title: 'Demo Video' },
        params: { videoId: 'video-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenNthCalledWith(1, 401)
    expect(res.status).toHaveBeenNthCalledWith(2, 400)
    expect(VideoService.createOrUpdate).toHaveBeenCalledWith(
      { title: 'Demo Video' },
      'user-1',
      'video-1'
    )
  })
})
