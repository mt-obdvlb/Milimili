import { describe, expect, it, vi } from 'vitest'
import { expectRequestCalled, mockRequest } from '@/__test__/utils/request.mock'

vi.mock('@/lib/request', () => ({
  default: mockRequest,
}))

import { commentCreate, commentDelete, commentList } from '@/services/comment'
import { followCreate, followDelete, followGet, followList } from '@/services/follow'
import {
  historyAdd,
  historyClearUp,
  historyDeleteBatch,
  historyGetList,
  historyGetRecent,
} from '@/services/history'
import { isLike, like, unlike } from '@/services/like'

describe('web services: comment/follow/history/like', () => {
  it('requests comment list, creation, and deletion', () => {
    const params = { videoId: 'video-1', page: 1, pageSize: 10, sort: 'new' } as const
    const body = { content: 'hello', videoId: 'video-1' }

    commentList(params)
    expectRequestCalled('get', '/comments/', { params })

    commentCreate(body)
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/comments', body)

    commentDelete('comment-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/comments/comment-1')
  })

  it('requests follow endpoints with the right transport', async () => {
    const query = { followingId: 'user-2' }
    const body = { followingId: 'user-2' }

    await followGet(query)
    expectRequestCalled('get', '/follows/', { params: query })

    await followCreate(body)
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/follows/', body)

    await followDelete(body)
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/follows/', {
      data: body,
    })

    await followList({ page: 1, pageSize: 20, userId: 'user-1', type: 'following' })
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/follows/list', {
      params: { page: 1, pageSize: 20, userId: 'user-1', type: 'following' },
    })
  })

  it('requests history endpoints', () => {
    const listParams = {
      page: 3,
      pageSize: 20,
      kw: 'test',
      time: 'all',
      watchAt: 'all',
    } as const
    const addBody = {
      duration: 100,
      videoId: 'video-1',
    }
    const deleteBody = {
      videoIds: ['history-1', 'history-2'],
    }

    historyGetRecent()
    expectRequestCalled('get', '/histories/recent')

    historyGetList(listParams)
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/histories/list', {
      params: listParams,
    })

    historyDeleteBatch(deleteBody)
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/histories/delete', deleteBody)

    historyClearUp()
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/histories/clear')

    historyAdd(addBody)
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/histories/', addBody)
  })

  it('requests like endpoints with the expected method', () => {
    const params = { videoId: 'video-1' }

    like(params)
    expectRequestCalled('post', '/likes', params)

    unlike(params)
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/likes', {
      params,
    })

    isLike(params)
    expect(mockRequest.get).toHaveBeenNthCalledWith(1, '/likes', {
      params,
    })
  })
})
