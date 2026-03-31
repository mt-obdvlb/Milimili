import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClientWrapper } from '@/__test__/utils/query-client'

const mocks = vi.hoisted(() => ({
  commentCreate: vi.fn(),
  commentDelete: vi.fn(),
  commentList: vi.fn(),
  favoriteCleanWatchLater: vi.fn(),
  favoriteDeleteBatch: vi.fn(),
  favoriteGetByVideoId: vi.fn(),
  favoriteIsWatchLater: vi.fn(),
  favoriteList: vi.fn(),
  favoriteMoveBatch: vi.fn(),
  followCreate: vi.fn(),
  followDelete: vi.fn(),
  followGet: vi.fn(),
  followList: vi.fn(),
  historyAdd: vi.fn(),
  historyClearUp: vi.fn(),
  historyDeleteBatch: vi.fn(),
  historyGetList: vi.fn(),
  historyGetRecent: vi.fn(),
  isLike: vi.fn(),
  likeApi: vi.fn(),
  unlikeApi: vi.fn(),
  videoGetWatchLater: vi.fn(),
}))

vi.mock('@/services/comment', () => ({
  commentCreate: mocks.commentCreate,
  commentDelete: mocks.commentDelete,
  commentList: mocks.commentList,
}))

vi.mock('@/services/favorite', () => ({
  favoriteDeleteBatch: mocks.favoriteDeleteBatch,
  favoriteGetByVideoId: mocks.favoriteGetByVideoId,
  favoriteList: mocks.favoriteList,
  favoriteMoveBatch: mocks.favoriteMoveBatch,
}))

vi.mock('@/services/follow', () => ({
  followCreate: mocks.followCreate,
  followDelete: mocks.followDelete,
  followGet: mocks.followGet,
  followList: mocks.followList,
}))

vi.mock('@/services/history', () => ({
  historyAdd: mocks.historyAdd,
  historyClearUp: mocks.historyClearUp,
  historyDeleteBatch: mocks.historyDeleteBatch,
  historyGetList: mocks.historyGetList,
  historyGetRecent: mocks.historyGetRecent,
}))

vi.mock('@/services/like', () => ({
  isLike: mocks.isLike,
  like: mocks.likeApi,
  unlike: mocks.unlikeApi,
}))

vi.mock('@/services', () => ({
  favoriteCleanWatchLater: mocks.favoriteCleanWatchLater,
  favoriteIsWatchLater: mocks.favoriteIsWatchLater,
  videoGetWatchLater: mocks.videoGetWatchLater,
}))

import {
  useComment,
  useCommentDelete,
  useInfiniteCommentList,
  usePageCommentList,
} from '@/features/comment/api'
import {
  useFavoriteGetByVideoId,
  useFavoriteList,
  useFavoriteMoveBatch,
} from '@/features/favorite/api'
import { useFollow, useFollowGet, useFollowList } from '@/features/follow/api'
import {
  useHistoryAdd,
  useHistoryCleanUp,
  useHistoryGetRecent,
  useHistoryList,
} from '@/features/history/api'
import { useLike, useLikeGet } from '@/features/like/api'
import {
  useIsWatchLater,
  useWatchLaterCleanUp,
  useWatchLaterList,
} from '@/features/watch-later/api'

describe('feature api: interaction hooks', () => {
  afterEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
  })

  it('loads comment pages, supports pagination, and invalidates after mutations', async () => {
    mocks.commentList
      .mockResolvedValueOnce({
        data: { list: [{ id: 'comment-1' }], total: 2 },
      })
      .mockResolvedValueOnce({
        data: { list: [{ id: 'comment-2' }], total: 2 },
      })
    mocks.commentCreate.mockResolvedValue({ code: 0 })
    mocks.commentDelete.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const infiniteHook = renderHook(
      () =>
        useInfiniteCommentList({
          videoId: 'video-1',
          feedId: undefined,
          commentId: undefined,
          sort: 'new',
        }),
      { wrapper: query.wrapper }
    )

    await waitFor(() => {
      expect(infiniteHook.result.current.commentList).toEqual([{ id: 'comment-1' }])
      expect(infiniteHook.result.current.total).toBe(2)
    })

    await act(async () => {
      await infiniteHook.result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(infiniteHook.result.current.commentList).toEqual([
        { id: 'comment-1' },
        { id: 'comment-2' },
      ])
    })

    const mutationHook = renderHook(() => useComment(), { wrapper: query.wrapper })
    await act(async () => {
      await mutationHook.result.current.comment({ content: 'hello', videoId: 'video-1' })
    })

    const deleteHook = renderHook(() => useCommentDelete(), { wrapper: query.wrapper })
    await act(async () => {
      await deleteHook.result.current.deleteComment('comment-1')
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['comment', 'list'] })

    const disabledHook = renderHook(
      () =>
        usePageCommentList({
          enabled: false,
          page: 1,
          sort: 'new',
          videoId: 'video-1',
        }),
      { wrapper: query.wrapper }
    )

    expect(disabledHook.result.current.commentList).toEqual([])
  })

  it('maps favorite state and invalidates favorite/video caches after move', async () => {
    mocks.favoriteGetByVideoId.mockResolvedValue({ code: 0 })
    mocks.favoriteList.mockResolvedValue({
      data: { list: [{ id: 'favorite-1' }], total: 1 },
    })
    mocks.favoriteMoveBatch.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const favoriteStateHook = renderHook(() => useFavoriteGetByVideoId('video-1'), {
      wrapper: query.wrapper,
    })
    const favoriteListHook = renderHook(
      () => useFavoriteList({ favoriteFolderId: 'folder-1', page: 1, pageSize: 20 }),
      { wrapper: query.wrapper }
    )

    await waitFor(() => {
      expect(favoriteStateHook.result.current.isFavorite).toBe(true)
      expect(favoriteListHook.result.current.favoriteList).toEqual([{ id: 'favorite-1' }])
      expect(favoriteListHook.result.current.total).toBe(1)
    })

    const moveHook = renderHook(() => useFavoriteMoveBatch(), { wrapper: query.wrapper })
    await act(async () => {
      await moveHook.result.current.favoriteMove({
        sourceFolderId: 'folder-1',
        targetFolderId: 'folder-2',
        videoIds: ['video-1'],
      })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['favorite'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['video', 'list'] })
  })

  it('handles follow queries and invalidates on follow/unfollow', async () => {
    mocks.followGet.mockResolvedValue({ code: 0 })
    mocks.followList.mockResolvedValue({
      data: { list: [{ id: 'user-2' }], total: 1 },
    })
    mocks.followCreate.mockResolvedValue({ code: 0 })
    mocks.followDelete.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const stateHook = renderHook(() => useFollowGet('user-2'), { wrapper: query.wrapper })
    const listHook = renderHook(
      () => useFollowList({ page: 1, pageSize: 20, userId: 'user-1', type: 'follow' }),
      { wrapper: query.wrapper }
    )

    await waitFor(() => {
      expect(stateHook.result.current.isFollowing).toBe(true)
      expect(listHook.result.current.followList).toEqual([{ id: 'user-2' }])
      expect(listHook.result.current.total).toBe(1)
    })

    const mutationHook = renderHook(() => useFollow('user-2'), { wrapper: query.wrapper })
    await act(async () => {
      await mutationHook.result.current.follow({ followingId: 'user-2' })
      await mutationHook.result.current.unfollow({ followingId: 'user-2' })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['follow', 'user-2'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['feed', 'list'] })
  })

  it('maps history lists and invalidates cleanup mutations', async () => {
    mocks.historyGetRecent.mockResolvedValue({
      data: [{ id: 'history-1' }],
    })
    mocks.historyGetList
      .mockResolvedValueOnce({
        data: { list: [{ id: 'history-1' }], total: 2 },
      })
      .mockResolvedValueOnce({
        data: { list: [{ id: 'history-2' }], total: 2 },
      })
    mocks.historyClearUp.mockResolvedValue({ code: 0 })
    mocks.historyAdd.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const recentHook = renderHook(() => useHistoryGetRecent(), { wrapper: query.wrapper })
    const listHook = renderHook(() => useHistoryList({ keyword: '动画' }, 1), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(recentHook.result.current.historyRecentList).toEqual([{ id: 'history-1' }])
      expect(listHook.result.current.historyList).toEqual([{ id: 'history-1' }])
    })

    await act(async () => {
      await listHook.result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(listHook.result.current.historyList).toEqual([
        { id: 'history-1' },
        { id: 'history-2' },
      ])
      expect(listHook.result.current.hasNextPage).toBe(false)
    })

    const cleanHook = renderHook(() => useHistoryCleanUp(), { wrapper: query.wrapper })
    await act(async () => {
      await cleanHook.result.current.cleanUp()
    })

    const addHook = renderHook(() => useHistoryAdd(), { wrapper: query.wrapper })
    await act(async () => {
      await addHook.result.current.historyAdd({ videoId: 'video-1', progress: 10 })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['history', 'list'],
    })
    expect(mocks.historyAdd).toHaveBeenCalledWith(
      { videoId: 'video-1', progress: 10 },
      expect.objectContaining({
        client: expect.any(Object),
      })
    )
  })

  it('handles like state and watch-later state with enabled guards', async () => {
    mocks.isLike.mockResolvedValue({ code: 0 })
    mocks.likeApi.mockResolvedValue({ code: 0 })
    mocks.unlikeApi.mockResolvedValue({ code: 0 })
    mocks.videoGetWatchLater.mockResolvedValue({ data: [{ id: 'video-1' }] })
    mocks.favoriteCleanWatchLater.mockResolvedValue({ code: 0 })
    mocks.favoriteIsWatchLater.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const disabledLikeHook = renderHook(() => useLikeGet({}), { wrapper: query.wrapper })
    expect(disabledLikeHook.result.current.isLike).toBe(true)
    expect(mocks.isLike).not.toHaveBeenCalled()

    const activeLikeHook = renderHook(() => useLikeGet({ videoId: 'video-1' }), {
      wrapper: query.wrapper,
    })
    const likeMutationHook = renderHook(() => useLike({ videoId: 'video-1' }), {
      wrapper: query.wrapper,
    })
    const watchLaterListHook = renderHook(() => useWatchLaterList({ page: 1, pageSize: 10 }), {
      wrapper: query.wrapper,
    })
    const isWatchLaterHook = renderHook(() => useIsWatchLater('video-1'), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(activeLikeHook.result.current.isLike).toBe(true)
      expect(watchLaterListHook.result.current.videoWatchLaterList).toEqual([{ id: 'video-1' }])
      expect(isWatchLaterHook.result.current.isFavorite).toBe(true)
    })

    await act(async () => {
      await likeMutationHook.result.current.like()
      await likeMutationHook.result.current.unlike()
    })

    const watchLaterCleanHook = renderHook(() => useWatchLaterCleanUp(), {
      wrapper: query.wrapper,
    })
    await act(async () => {
      await watchLaterCleanHook.result.current.cleanUp()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['like', { videoId: 'video-1' }] })
    expect(invalidateSpy).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['video', 'list', 'watchLater'],
    })
  })
})
