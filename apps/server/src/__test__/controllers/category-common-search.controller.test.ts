import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, createMockResponse } from '@/__test__/utils/controller-test.utils'

vi.mock('@/services/category.service', () => ({
  CategoryService: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getByName: vi.fn(),
  },
}))

vi.mock('@/utils', () => ({
  getUploadURL: vi.fn(),
}))

vi.mock('@/services', () => ({
  SearchLogService: {
    add: vi.fn(),
  },
  SearchService: {
    get: vi.fn(),
  },
}))

import {
  categoryCreate,
  categoryGetAll,
  categoryGetById,
  categoryGetByName,
} from '@/controllers/category.controller'
import { commonUploadFile } from '@/controllers/common.controller'
import { searchGet } from '@/controllers/search.controller'
import { CategoryService } from '@/services/category.service'
import { SearchLogService, SearchService } from '@/services'
import { getUploadURL } from '@/utils'

describe('category/common/search controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('categoryGetAll returns service data', async () => {
    vi.mocked(CategoryService.getAll).mockResolvedValue([{ id: 'cat-1', name: 'Music' }] as never)

    const res = createMockResponse()

    await categoryGetAll(createMockRequest(), res, vi.fn())

    expect(CategoryService.getAll).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      code: 0,
      data: [{ id: 'cat-1', name: 'Music' }],
    })
  })

  it('categoryCreate delegates body.name to CategoryService.create', async () => {
    const res = createMockResponse()

    await categoryCreate(createMockRequest({ body: { name: 'Music' } }), res, vi.fn())

    expect(CategoryService.create).toHaveBeenCalledWith('Music')
    expect(res.json).toHaveBeenCalledWith({ code: 0 })
  })

  it('categoryGetById reads the category id from req.body', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue({ id: 'cat-1', name: 'Music' } as never)

    const res = createMockResponse()

    await categoryGetById(
      createMockRequest({
        body: { id: 'cat-1' },
        params: { id: 'wrong-id' },
      }),
      res,
      vi.fn()
    )

    expect(CategoryService.getById).toHaveBeenCalledWith('cat-1')
  })

  it('categoryGetByName reads the category name from req.body', async () => {
    vi.mocked(CategoryService.getByName).mockResolvedValue({ id: 'cat-1', name: 'Music' } as never)

    const res = createMockResponse()

    await categoryGetByName(
      createMockRequest({
        body: { name: 'Music' },
        query: { name: 'wrong-name' },
      }),
      res,
      vi.fn()
    )

    expect(CategoryService.getByName).toHaveBeenCalledWith('Music')
  })

  it('commonUploadFile reads fileName from req.body', async () => {
    vi.mocked(getUploadURL).mockResolvedValue({
      fileName: 'cover.png',
      uploadUrl: 'https://oss.example.com',
    } as never)

    const res = createMockResponse()

    await commonUploadFile(
      createMockRequest({
        body: { fileName: 'cover.png' },
        query: { fileName: 'wrong.png' },
      }),
      res,
      vi.fn()
    )

    expect(getUploadURL).toHaveBeenCalledWith('cover.png')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('commonUploadFile returns 400 when fileName is missing', async () => {
    const res = createMockResponse()

    await commonUploadFile(createMockRequest(), res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(400)
    expect(getUploadURL).not.toHaveBeenCalled()
  })

  it('searchGet logs and searches using req.body', async () => {
    vi.mocked(SearchService.get).mockResolvedValue({ list: [], total: 0 } as never)

    const res = createMockResponse()
    const body = { kw: '猫猫', page: 1, pageSize: 20 }

    await searchGet(
      createMockRequest({
        body,
        query: { kw: 'wrong' },
      }),
      res,
      vi.fn()
    )

    expect(SearchLogService.add).toHaveBeenCalledWith({ keyword: '猫猫' })
    expect(SearchService.get).toHaveBeenCalledWith(body)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
