import { describe, expect, it, vi } from 'vitest'
import { expectRequestCalled, mockRequest } from '@/__test__/utils/request.mock'

vi.mock('@/lib/request', () => ({
  default: mockRequest,
}))

import { authSendCode } from '@/services/auth'
import { categoryGet, categoryGetById, categoryGetByName } from '@/services/category'
import { commonUpload } from '@/services/common'
import { searchLogGet, searchLogGetTop10 } from '@/services/search-log'
import { searchGet } from '@/services/search'

describe('web services: auth/category/common/search', () => {
  it('posts the auth send-code payload', () => {
    const body = { email: 'user@example.com' }

    authSendCode(body)

    expectRequestCalled('post', '/auth/send-code', body)
  })

  it('requests category list and details', () => {
    const params = { name: '动画' }

    categoryGet()
    expectRequestCalled('get', '/categories/')

    categoryGetById('cate-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/categories/id/cate-1')

    categoryGetByName(params)
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/categories/name', {
      params,
    })
  })

  it('requests a common upload url', () => {
    const params = { fileName: 'cover.png' }

    commonUpload(params)

    expectRequestCalled('get', '/commons/upload', { params })
  })

  it('requests search-log endpoints', () => {
    searchLogGetTop10()
    expectRequestCalled('get', '/search-logs/top10')

    searchLogGet('milimili')
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/search-logs/', {
      params: { keyword: 'milimili' },
    })
  })

  it('requests the search endpoint with params', () => {
    const params = {
      kw: '猫',
      page: 2,
      publishedAt: 'all',
      sort: 'all',
      time: 'all',
      type: 'all',
    } as const

    searchGet(params)

    expectRequestCalled('get', '/searches/', { params })
  })
})
