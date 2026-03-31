import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services', () => ({
  CommentService: {
    comment: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
  LikeService: {
    isLike: vi.fn(),
    like: vi.fn(),
    unlike: vi.fn(),
  },
}))

vi.mock('@/services/follow.service', () => ({
  FollowService: {
    create: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    list: vi.fn(),
  },
}))

import { MESSAGE } from '@/constants'
import { comment, commentDelete, commentGet } from '@/controllers/comment.controller'
import { followCreate, followDelete, followGet, followList } from '@/controllers/follow.controller'
import { like, likeGet, unlike } from '@/controllers/like.controller'
import { CommentService, LikeService } from '@/services'
import { FollowService } from '@/services/follow.service'

describe('comment/follow/like controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('commentGet passes req.body to CommentService.get', async () => {
    vi.mocked(CommentService.get).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { page: 1, pageSize: 20, videoId: 'video-1' }

    await commentGet(createMockRequest({ body, query: { page: '9' } }), res, vi.fn())

    expect(CommentService.get).toHaveBeenCalledWith(body)
  })

  it('commentDelete passes req.body to CommentService.delete', async () => {
    const res = createMockResponse()
    const body = { id: 'comment-1' }

    await commentDelete(
      createMockRequest({
        body,
        params: { id: 'wrong-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(CommentService.delete).toHaveBeenCalledWith('user-1', body)
  })

  it('comment returns 401 when user is missing', async () => {
    const res = createMockResponse()

    await comment(createMockRequest({ body: { content: 'hi' } }), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(CommentService.comment).not.toHaveBeenCalled()
  })

  it('followGet reads followingId from req.body', async () => {
    vi.mocked(FollowService.get).mockResolvedValue({ code: 0 } as never)

    const res = createMockResponse()

    await followGet(
      createMockRequest({
        body: { followingId: 'user-2' },
        query: { followingId: 'wrong-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FollowService.get).toHaveBeenCalledWith({
      followingId: 'user-2',
      userId: 'user-1',
    })
  })

  it('followList reads pagination from req.body', async () => {
    vi.mocked(FollowService.list).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { page: 1, pageSize: 20, userId: 'user-2' }

    await followList(createMockRequest({ body, query: { page: '9' } }), res, vi.fn())

    expect(FollowService.list).toHaveBeenCalledWith(body)
  })

  it('followCreate and followDelete keep using req.body for mutations', async () => {
    const res = createMockResponse()
    const payload = { followingId: 'user-2' }

    await followCreate(createMockRequest({ body: payload, user: { id: 'user-1' } }), res, vi.fn())
    await followDelete(createMockRequest({ body: payload, user: { id: 'user-1' } }), res, vi.fn())

    expect(FollowService.create).toHaveBeenCalledWith({ followingId: 'user-2', userId: 'user-1' })
    expect(FollowService.delete).toHaveBeenCalledWith({ followingId: 'user-2', userId: 'user-1' })
  })

  it('likeGet and unlike both read req.body', async () => {
    vi.mocked(LikeService.isLike).mockResolvedValue(0 as never)

    const res = createMockResponse()
    const body = { bizId: 'video-1', bizType: 'video' }

    await likeGet(
      createMockRequest({ body, query: { bizId: 'wrong' }, user: { id: 'user-1' } }),
      res,
      vi.fn()
    )
    await unlike(
      createMockRequest({ body, query: { bizId: 'wrong' }, user: { id: 'user-1' } }),
      res,
      vi.fn()
    )

    expect(LikeService.isLike).toHaveBeenCalledWith('user-1', body)
    expect(LikeService.unlike).toHaveBeenCalledWith('user-1', body)
  })

  it('like returns auth error without a user', async () => {
    const res = createMockResponse()

    await like(createMockRequest({ body: { bizId: 'video-1', bizType: 'video' } }), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  })
})
