import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClientWrapper } from '@/__test__/utils/query-client'

const mocks = vi.hoisted(() => ({
  authSendCode: vi.fn(),
  axiosPut: vi.fn(),
  categoryGet: vi.fn(),
  categoryGetById: vi.fn(),
  categoryGetByName: vi.fn(),
  commonUpload: vi.fn(),
  danmakuAdd: vi.fn(),
  danmakuGet: vi.fn(),
  searchGet: vi.fn(),
  searchLogGet: vi.fn(),
  searchLogGetTop10: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    put: mocks.axiosPut,
  },
}))

vi.mock('@/services/auth', () => ({
  authSendCode: mocks.authSendCode,
}))

vi.mock('@/services/category', () => ({
  categoryGet: mocks.categoryGet,
  categoryGetById: mocks.categoryGetById,
  categoryGetByName: mocks.categoryGetByName,
}))

vi.mock('@/services/danmaku', () => ({
  danmakuAdd: mocks.danmakuAdd,
  danmakuGet: mocks.danmakuGet,
}))

vi.mock('@/services/search-log', () => ({
  searchLogGet: mocks.searchLogGet,
  searchLogGetTop10: mocks.searchLogGetTop10,
}))

vi.mock('@/services/search', () => ({
  searchGet: mocks.searchGet,
}))

vi.mock('@/services', () => ({
  commonUpload: mocks.commonUpload,
}))

import { useAuthSendCode } from '@/features/auth/api'
import {
  getCategoryList,
  getCategoryName,
  useCategoryGetBy,
  useCategoryList,
} from '@/features/category/api'
import { useUploadFile } from '@/features/common/api'
import { useDanmakuAdd, useDanmakuGet } from '@/features/danmaku/api'
import { getSearchLogTop10, useSearchLogGet } from '@/features/search-log/api'
import { useSearch } from '@/features/search/api'

describe('feature api: foundation hooks', () => {
  afterEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
  })

  it('delegates auth send-code mutations to the auth service', async () => {
    mocks.authSendCode.mockResolvedValue({ code: 0 })
    const { wrapper } = createQueryClientWrapper()
    const { result } = renderHook(() => useAuthSendCode(), { wrapper })

    await act(async () => {
      await result.current.sendCode({ email: 'user@example.com' })
    })

    expect(mocks.authSendCode).toHaveBeenCalledWith(
      { email: 'user@example.com' },
      expect.objectContaining({
        client: expect.any(Object),
      })
    )
  })

  it('maps category queries and pure helpers', async () => {
    mocks.categoryGet.mockResolvedValue({
      data: [{ id: 'cate-1', name: '动画' }],
    })
    mocks.categoryGetById.mockResolvedValue({
      data: { id: 'cate-1', name: '动画' },
    })
    mocks.categoryGetByName.mockResolvedValue({
      data: { id: 'cate-2', name: '番剧' },
    })

    await expect(getCategoryList()).resolves.toEqual({
      categoryList: [{ id: 'cate-1', name: '动画' }],
    })
    await expect(getCategoryName('cate-1')).resolves.toEqual({
      categoryName: '动画',
    })

    const { wrapper } = createQueryClientWrapper()
    const listHook = renderHook(() => useCategoryList(), { wrapper })
    const byIdHook = renderHook(() => useCategoryGetBy('cate-1'), { wrapper })
    const byNameHook = renderHook(() => useCategoryGetBy(undefined, '番剧'), { wrapper })

    await waitFor(() => {
      expect(listHook.result.current.categoryList).toEqual([{ id: 'cate-1', name: '动画' }])
      expect(byIdHook.result.current.category).toEqual({ id: 'cate-1', name: '动画' })
      expect(byNameHook.result.current.category).toEqual({ id: 'cate-2', name: '番剧' })
    })
  })

  it('uploads a file and exposes upload progress', async () => {
    mocks.commonUpload.mockResolvedValue({
      data: {
        objectKey: 'uploads/file.png',
        url: 'https://upload.example.com/file',
      },
    })
    mocks.axiosPut.mockImplementation(async (_url, _file, config) => {
      config.onUploadProgress?.({ loaded: 1, total: 2 })
    })

    const { wrapper } = createQueryClientWrapper()
    const { result } = renderHook(() => useUploadFile(), { wrapper })
    const file = new File(['hello'], 'file.png', { type: 'image/png' })

    await act(async () => {
      await result.current.uploadFile(file)
    })

    expect(mocks.commonUpload).toHaveBeenCalledWith({ fileName: 'file.png' })
    expect(mocks.axiosPut).toHaveBeenCalled()
    expect(result.current.progress).toBe(50)
    expect(result.current.data).toEqual({
      fileUrl: 'https://mtobdvlb-web.oss-cn-beijing.aliyuncs.com/uploads/file.png',
    })
  })

  it('loads danmaku conditionally and forwards add mutations', async () => {
    mocks.danmakuGet.mockResolvedValue({
      data: [{ id: 'danmaku-1', content: '2333' }],
    })
    mocks.danmakuAdd.mockResolvedValue({ code: 0 })
    const { wrapper } = createQueryClientWrapper()

    const disabledHook = renderHook(() => useDanmakuGet('', false), { wrapper })
    expect(disabledHook.result.current.danmakuList).toEqual([])
    expect(mocks.danmakuGet).not.toHaveBeenCalled()

    const enabledHook = renderHook(() => useDanmakuGet('video-1'), { wrapper })
    await waitFor(() => {
      expect(enabledHook.result.current.danmakuList).toEqual([{ id: 'danmaku-1', content: '2333' }])
    })

    const addHook = renderHook(() => useDanmakuAdd(), { wrapper })
    await act(async () => {
      await addHook.result.current.danmakuAdd({ videoId: 'video-1', content: '2333', time: 10 })
    })

    expect(mocks.danmakuAdd).toHaveBeenCalledWith({ videoId: 'video-1', content: '2333', time: 10 })
  })

  it('maps search-log and search query results', async () => {
    mocks.searchLogGetTop10.mockResolvedValue({
      data: ['动画', '番剧'],
    })
    mocks.searchLogGet.mockResolvedValue({
      data: ['动画', '番剧'],
    })
    mocks.searchGet.mockResolvedValue({
      data: {
        list: {
          list: [{ id: 'video-1', title: 'Milimili' }],
          total: 1,
        },
        user: [{ id: 'user-1', username: 'milimili' }],
      },
    })

    await expect(getSearchLogTop10()).resolves.toEqual({
      searchLogTop10List: ['动画', '番剧'],
    })

    const { wrapper } = createQueryClientWrapper()
    const searchLogHook = renderHook(() => useSearchLogGet('动画'), { wrapper })
    const searchHook = renderHook(
      () =>
        useSearch({
          keyword: '动画',
          page: 1,
          pageSize: 10,
          type: 'all',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(searchLogHook.result.current.searchLogList).toEqual(['动画', '番剧'])
      expect(searchHook.result.current.searchList).toEqual([{ id: 'video-1', title: 'Milimili' }])
      expect(searchHook.result.current.searchUser).toEqual([{ id: 'user-1', username: 'milimili' }])
      expect(searchHook.result.current.total).toBe(1)
    })
  })
})
