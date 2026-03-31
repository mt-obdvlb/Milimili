import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/feed.service', () => ({
  FeedService: {
    create: vi.fn(),
    followingList: vi.fn(),
    recent: vi.fn(),
    transpont: vi.fn(),
  },
}))

vi.mock('@/services/history.service', () => ({
  HistoryService: {
    add: vi.fn(),
    clear: vi.fn(),
    deleteBatch: vi.fn(),
    list: vi.fn(),
  },
}))

vi.mock('@/services/message.service', () => ({
  MessageService: {
    sendWhisper: vi.fn(),
    statistics: vi.fn(),
  },
}))

vi.mock('@/services/search-log.service', () => ({
  SearchLogService: {
    add: vi.fn(),
    get: vi.fn(),
    getTop10: vi.fn(),
  },
}))

import { MESSAGE } from '@/constants'
import {
  feedCreate,
  feedFollowingList,
  feedRecent,
  feedTranspont,
} from '@/controllers/feed.controller'
import {
  historyAdd,
  historyClearUp,
  historyDeleteBatch,
  historyRecent,
} from '@/controllers/history.controller'
import { messageSendWhisper, messageStatistics } from '@/controllers/message.controller'
import { searchLogAdd, searchLogGet, searchLogTop10 } from '@/controllers/search-log.controller'
import { FeedService } from '@/services/feed.service'
import { HistoryService } from '@/services/history.service'
import { MessageService } from '@/services/message.service'
import { SearchLogService } from '@/services/search-log.service'

describe('feed/history/message/search-log controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('feedRecent and feedFollowingList require auth and then delegate with user id', async () => {
    vi.mocked(FeedService.recent).mockResolvedValue(['recent-feed'] as never)
    vi.mocked(FeedService.followingList).mockResolvedValue(['following-feed'] as never)

    const unauthorizedRes = createMockResponse()
    const authorizedRes = createMockResponse()

    await feedRecent(createMockRequest(), unauthorizedRes, vi.fn())
    await feedFollowingList(
      createMockRequest({
        user: { id: 'user-1' },
      }),
      authorizedRes,
      vi.fn()
    )

    expect(unauthorizedRes.status).toHaveBeenCalledWith(401)
    expect(FeedService.recent).not.toHaveBeenCalled()
    expect(FeedService.followingList).toHaveBeenCalledWith('user-1')
  })

  it('feedCreate and feedTranspont use the current request body', async () => {
    const res = createMockResponse()

    await feedCreate(
      createMockRequest({
        body: { content: 'hello feed' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await feedTranspont(
      createMockRequest({
        body: { feedId: 'feed-1' },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(FeedService.create).toHaveBeenCalledWith('user-1', { content: 'hello feed' })
    expect(FeedService.transpont).toHaveBeenCalledWith('user-1', { feedId: 'feed-1' })
  })

  it('historyRecent uses fixed pagination, historyAdd injects userId, historyDeleteBatch and clear use user id', async () => {
    vi.mocked(HistoryService.list).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const historyBody = { currentTime: 42, videoId: 'video-1' }

    await historyRecent(
      createMockRequest({
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await historyAdd(
      createMockRequest({
        body: historyBody,
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await historyDeleteBatch(
      createMockRequest({
        body: { videoIds: ['video-1', 'video-2'] },
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    await historyClearUp(
      createMockRequest({
        user: { id: 'user-1' },
      }),
      res,
      vi.fn()
    )

    expect(HistoryService.list).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      userId: 'user-1',
    })
    expect(HistoryService.add).toHaveBeenCalledWith({
      currentTime: 42,
      userId: 'user-1',
      videoId: 'video-1',
    })
    expect(HistoryService.deleteBatch).toHaveBeenCalledWith({
      userId: 'user-1',
      videoIds: ['video-1', 'video-2'],
    })
    expect(HistoryService.clear).toHaveBeenCalledWith({
      userId: 'user-1',
    })
  })

  it('messageStatistics and messageSendWhisper return invalid-token payload without auth and delegate when authorized', async () => {
    vi.mocked(MessageService.statistics).mockResolvedValue([{ type: 'whisper', count: 1 }] as never)

    const unauthorizedRes = createMockResponse()
    const authorizedRes = createMockResponse()

    await messageStatistics(createMockRequest(), unauthorizedRes, vi.fn())

    await messageSendWhisper(
      createMockRequest({
        body: { content: 'hi', toId: 'user-2' },
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
    expect(MessageService.sendWhisper).toHaveBeenCalledWith({
      content: 'hi',
      id: 'user-1',
      toId: 'user-2',
    })
  })

  it('searchLog controllers cover add, top10, and list flows', async () => {
    vi.mocked(SearchLogService.getTop10).mockResolvedValue([
      { keyword: 'milimili', rank: 1 },
    ] as never)
    vi.mocked(SearchLogService.get).mockResolvedValue(['milimili'] as never)

    const res = createMockResponse()

    await searchLogAdd(createMockRequest({ body: {} }), res, vi.fn())
    await searchLogAdd(createMockRequest({ body: { keyword: 'milimili' } }), res, vi.fn())
    await searchLogTop10(createMockRequest(), res, vi.fn())
    await searchLogGet(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenNthCalledWith(1, 400)
    expect(SearchLogService.add).toHaveBeenCalledWith({ keyword: 'milimili' })
    expect(SearchLogService.getTop10).toHaveBeenCalledTimes(1)
    expect(SearchLogService.get).toHaveBeenCalledTimes(1)
  })
})
