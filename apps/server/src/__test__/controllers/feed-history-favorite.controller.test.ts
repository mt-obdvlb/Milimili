import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/favorite.service', () => ({
  FavoriteService: {
    list: vi.fn(),
  },
}))

vi.mock('@/services/feed.service', () => ({
  FeedService: {
    delete: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    listLikeTranspont: vi.fn(),
  },
}))

vi.mock('@/services/history.service', () => ({
  HistoryService: {
    get: vi.fn(),
    list: vi.fn(),
  },
}))

import { favoriteList } from '@/controllers/favorite.controller'
import {
  feedDelete,
  feedGetById,
  feedList,
  feedListLikeTranspont,
} from '@/controllers/feed.controller'
import { historyGet, historyList } from '@/controllers/history.controller'
import { FavoriteService } from '@/services/favorite.service'
import { FeedService } from '@/services/feed.service'
import { HistoryService } from '@/services/history.service'

describe('feed/history/favorite controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('favoriteList reads filters from req.body', async () => {
    vi.mocked(FavoriteService.list).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { folderId: 'folder-1', page: 1, pageSize: 20 }

    await favoriteList(createMockRequest({ body, query: { folderId: 'wrong' } }), res, vi.fn())

    expect(FavoriteService.list).toHaveBeenCalledWith(body)
  })

  it('feedList reads pagination from req.body', async () => {
    vi.mocked(FeedService.list).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { page: 1, pageSize: 20 }

    await feedList(
      createMockRequest({
        body,
        query: { page: '9' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FeedService.list).toHaveBeenCalledWith('user-1', body)
  })

  it('feedDelete reads the feed id from req.body', async () => {
    const res = createMockResponse()
    const body = { id: 'feed-1' }

    await feedDelete(
      createMockRequest({
        body,
        params: { id: 'wrong-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FeedService.delete).toHaveBeenCalledWith('user-1', body)
  })

  it('feedGetById reads req.body and feedListLikeTranspont reads req.body plus req.params.id', async () => {
    vi.mocked(FeedService.getById).mockResolvedValue({ id: 'feed-1' } as never)
    vi.mocked(FeedService.listLikeTranspont).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const getBody = { id: 'feed-1' }
    const listBody = { page: 1, pageSize: 20 }

    await feedGetById(
      createMockRequest({
        body: getBody,
        params: { id: 'wrong-id' },
      }),
      res,
      vi.fn()
    )

    await feedListLikeTranspont(
      createMockRequest({
        body: listBody,
        params: { id: 'feed-1' },
        query: { page: '9' },
      }),
      res,
      vi.fn()
    )

    expect(FeedService.getById).toHaveBeenCalledWith(getBody)
    expect(FeedService.listLikeTranspont).toHaveBeenCalledWith('feed-1', listBody)
  })

  it('historyList and historyGet both read req.body', async () => {
    vi.mocked(HistoryService.list).mockResolvedValue({ list: [], total: 0 } as never)
    vi.mocked(HistoryService.get).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const listBody = { page: 1, pageSize: 20 }
    const getBody = { videoId: 'video-1' }

    await historyList(
      createMockRequest({
        body: listBody,
        query: { page: '9' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await historyGet(
      createMockRequest({
        body: getBody,
        query: { videoId: 'wrong-id' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(HistoryService.list).toHaveBeenCalledWith({
      ...listBody,
      userId: 'user-1',
    })
    expect(HistoryService.get).toHaveBeenCalledWith('user-1', getBody)
  })
})
