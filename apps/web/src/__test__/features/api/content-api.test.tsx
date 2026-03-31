import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClientWrapper } from '@/__test__/utils/query-client'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  getUserAtList: vi.fn(),
  getUserByEmail: vi.fn(),
  getUserById: vi.fn(),
  getUserByName: vi.fn(),
  messageCreateConversation: vi.fn(),
  messageDelete: vi.fn(),
  messageDeleteConversation: vi.fn(),
  messageGetConversation: vi.fn(),
  messageGetList: vi.fn(),
  messageGetStatistics: vi.fn(),
  messageRead: vi.fn(),
  messageSendWhisper: vi.fn(),
  updateUser: vi.fn(),
  userGetHomeInfo: vi.fn(),
  videoCreate: vi.fn(),
  videoDelete: vi.fn(),
  videoGetDetail: vi.fn(),
  videoList: vi.fn(),
  videoListLike: vi.fn(),
  videoListSpace: vi.fn(),
  videoShare: vi.fn(),
  videoUpdate: vi.fn(),
  feedDelete: vi.fn(),
  feedGetById: vi.fn(),
  feedGetFollowing: vi.fn(),
  feedGetRecent: vi.fn(),
  feedList: vi.fn(),
  feedListLikeTranspont: vi.fn(),
  feedPublish: vi.fn(),
  feedTranspont: vi.fn(),
}))

vi.mock('@/services/feed', () => ({
  feedDelete: mocks.feedDelete,
  feedGetById: mocks.feedGetById,
  feedGetFollowing: mocks.feedGetFollowing,
  feedGetRecent: mocks.feedGetRecent,
  feedList: mocks.feedList,
  feedListLikeTranspont: mocks.feedListLikeTranspont,
  feedPublish: mocks.feedPublish,
  feedTranspont: mocks.feedTranspont,
}))

vi.mock('@/services', () => ({
  messageCreateConversation: mocks.messageCreateConversation,
  messageDelete: mocks.messageDelete,
  messageDeleteConversation: mocks.messageDeleteConversation,
  messageGetConversation: mocks.messageGetConversation,
  messageGetList: mocks.messageGetList,
  messageGetStatistics: mocks.messageGetStatistics,
  messageRead: mocks.messageRead,
  messageSendWhisper: mocks.messageSendWhisper,
  updateUser: mocks.updateUser,
}))

vi.mock('@/services/user', () => ({
  getUser: mocks.getUser,
  getUserAtList: mocks.getUserAtList,
  getUserByEmail: mocks.getUserByEmail,
  getUserById: mocks.getUserById,
  getUserByName: mocks.getUserByName,
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  userFindPassword: vi.fn(),
  userGetHomeInfo: mocks.userGetHomeInfo,
}))

vi.mock('@/services/video', () => ({
  videoCreate: mocks.videoCreate,
  videoDelete: mocks.videoDelete,
  videoGetDetail: mocks.videoGetDetail,
  videoList: mocks.videoList,
  videoListLike: mocks.videoListLike,
  videoListSpace: mocks.videoListSpace,
  videoShare: mocks.videoShare,
  videoUpdate: mocks.videoUpdate,
}))

import {
  useFeedDelete,
  useFeedGetById,
  useFeedGetFollowingList,
  useFeedGetList,
  useFeedGetListLikeTranspont,
  useFeedGetRecent,
  useFeedPublish,
  useFeedTranspont,
} from '@/features/feed/api'
import {
  useMessageConversation,
  useMessageConversationDetail,
  useMessageDelete,
  useMessageList,
  useMessageRead,
  useMessageSend,
  useMessageStatistics,
} from '@/features/message/api'
import {
  getUserHomeInfo,
  useUserGet,
  useUserGetAtList,
  useUserGetByEmail,
  useUserGetById,
  useUserGetByName,
  useUserUpdateInfo,
} from '@/features/user/api'
import {
  getVideoDetail,
  getVideoList,
  useVideoCreateUpdate,
  useVideoDelete,
  useVideoDetail,
  useVideoLikeList,
  useVideoList,
  useVideoListSpace,
  useVideoPageList,
  useVideoShare,
} from '@/features/video/api'

describe('feature api: content hooks', () => {
  afterEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
  })

  it('maps feed queries and invalidates list mutations', async () => {
    mocks.feedGetRecent.mockResolvedValue({ data: [{ id: 'feed-recent' }] })
    mocks.feedGetFollowing.mockResolvedValue({ data: [{ id: 'user-2' }] })
    mocks.feedGetById.mockResolvedValue({ data: { id: 'feed-1' } })
    mocks.feedList
      .mockResolvedValueOnce({ data: { list: [{ id: 'feed-1' }], total: 2 } })
      .mockResolvedValueOnce({ data: { list: [{ id: 'feed-2' }], total: 2 } })
    mocks.feedListLikeTranspont
      .mockResolvedValueOnce({ data: { list: [{ id: 'like-1' }], total: 2 } })
      .mockResolvedValueOnce({ data: { list: [{ id: 'like-2' }], total: 2 } })
    mocks.feedPublish.mockResolvedValue({ code: 0 })
    mocks.feedTranspont.mockResolvedValue({ code: 0 })
    mocks.feedDelete.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const recentHook = renderHook(() => useFeedGetRecent(), { wrapper: query.wrapper })
    const followingHook = renderHook(() => useFeedGetFollowingList(), { wrapper: query.wrapper })
    const detailHook = renderHook(() => useFeedGetById('feed-1'), { wrapper: query.wrapper })
    const listHook = renderHook(() => useFeedGetList({ type: 'all', userId: 'user-1' }), {
      wrapper: query.wrapper,
    })
    const likeListHook = renderHook(() => useFeedGetListLikeTranspont({ feedId: 'feed-1' }), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(recentHook.result.current.feedRecentList).toEqual([{ id: 'feed-recent' }])
      expect(followingHook.result.current.followingList).toEqual([{ id: 'user-2' }])
      expect(detailHook.result.current.feed).toEqual({ id: 'feed-1' })
      expect(listHook.result.current.feedList).toEqual([{ id: 'feed-1' }])
      expect(likeListHook.result.current.likeTranspotList).toEqual([{ id: 'like-1' }])
    })

    await act(async () => {
      await listHook.result.current.fetchNextPage()
      await likeListHook.result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(listHook.result.current.feedList).toEqual([{ id: 'feed-1' }, { id: 'feed-2' }])
      expect(likeListHook.result.current.likeTranspotList).toEqual([
        { id: 'like-1' },
        { id: 'like-2' },
      ])
    })

    const publishHook = renderHook(() => useFeedPublish(), { wrapper: query.wrapper })
    const transpontHook = renderHook(() => useFeedTranspont(), { wrapper: query.wrapper })
    const deleteHook = renderHook(() => useFeedDelete(), { wrapper: query.wrapper })

    await act(async () => {
      await publishHook.result.current.publishFeed({ content: 'hello' })
      await transpontHook.result.current.transpont({ feedId: 'feed-1', content: '转发' })
      await deleteHook.result.current.deleteFeed('feed-1')
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['feed', 'list'] })
  })

  it('maps message queries and invalidates conversation/statistics mutations', async () => {
    mocks.messageGetStatistics.mockResolvedValue({ data: { reply: 1 } })
    mocks.messageGetList
      .mockResolvedValueOnce({ data: { list: [{ id: 'message-1' }], total: 2 } })
      .mockResolvedValueOnce({ data: { list: [{ id: 'message-2' }], total: 2 } })
    mocks.messageGetConversation.mockResolvedValue({ data: [{ id: 'conversation-1' }] })
    mocks.messageDelete.mockResolvedValue({ code: 0 })
    mocks.messageRead.mockResolvedValue({ code: 0 })
    mocks.messageDeleteConversation.mockResolvedValue({ code: 0 })
    mocks.messageCreateConversation.mockResolvedValue({ code: 0 })
    mocks.messageSendWhisper.mockResolvedValue({ code: 0 })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const statisticsHook = renderHook(() => useMessageStatistics(), { wrapper: query.wrapper })
    const listHook = renderHook(() => useMessageList('reply'), { wrapper: query.wrapper })
    const conversationHook = renderHook(() => useMessageConversationDetail('user-2'), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(statisticsHook.result.current.messageStatistics).toEqual({ reply: 1 })
      expect(listHook.result.current.messageList).toEqual([{ id: 'message-1' }])
      expect(conversationHook.result.current.conversation).toEqual([{ id: 'conversation-1' }])
    })

    await act(async () => {
      await listHook.result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(listHook.result.current.messageList).toEqual([
        { id: 'message-1' },
        { id: 'message-2' },
      ])
    })

    const deleteHook = renderHook(() => useMessageDelete(), { wrapper: query.wrapper })
    const readHook = renderHook(() => useMessageRead(), { wrapper: query.wrapper })
    const conversationMutationHook = renderHook(() => useMessageConversation(), {
      wrapper: query.wrapper,
    })
    const sendHook = renderHook(() => useMessageSend('user-2'), { wrapper: query.wrapper })

    await act(async () => {
      await deleteHook.result.current.deleteMessage('message-1')
      await readHook.result.current.readMessage({ type: 'reply' })
      await conversationMutationHook.result.current.createConversation('user-2')
      await conversationMutationHook.result.current.deleteConversation('conversation-1')
      await sendHook.result.current.sendMessage({ receiverId: 'user-2', content: '你好' })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['messages'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['messages', 'statistics'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['conversation', 'user-2'] })
  })

  it('maps user queries and updates user cache after profile changes', async () => {
    mocks.getUser.mockResolvedValue({ data: { id: 'user-1', username: 'milimili' } })
    mocks.userGetHomeInfo.mockResolvedValue({ data: { id: 'user-1', username: 'home' } })
    mocks.getUserByName.mockResolvedValue({ data: { id: 'user-2', username: 'mili' } })
    mocks.getUserById.mockResolvedValue({ data: { id: 'user-3', username: 'id-user' } })
    mocks.getUserByEmail.mockResolvedValue({ data: { exists: true } })
    mocks.getUserAtList
      .mockResolvedValueOnce({ data: { list: [{ id: 'user-4' }], total: 2 } })
      .mockResolvedValueOnce({ data: { list: [{ id: 'user-5' }], total: 2 } })
    mocks.updateUser.mockResolvedValue({ code: 0 })

    await expect(getUserHomeInfo()).resolves.toEqual({
      userHomeInfo: { id: 'user-1', username: 'home' },
    })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const userHook = renderHook(() => useUserGet(), { wrapper: query.wrapper })
    const byNameHook = renderHook(() => useUserGetByName('mili'), { wrapper: query.wrapper })
    const byIdHook = renderHook(() => useUserGetById('user-3'), { wrapper: query.wrapper })
    const atListHook = renderHook(() => useUserGetAtList('mi'), { wrapper: query.wrapper })
    const byEmailHook = renderHook(() => useUserGetByEmail('user@example.com'), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(userHook.result.current.user).toEqual({ id: 'user-1', username: 'milimili' })
      expect(byNameHook.result.current.data).toEqual({ id: 'user-2', username: 'mili' })
      expect(byIdHook.result.current.user).toEqual({ id: 'user-3', username: 'id-user' })
      expect(atListHook.result.current.atList).toEqual([{ id: 'user-4' }])
    })

    await act(async () => {
      await atListHook.result.current.fetchNextPage()
      await byEmailHook.result.current.getByEmail()
    })

    await waitFor(() => {
      expect(atListHook.result.current.atList).toEqual([{ id: 'user-4' }, { id: 'user-5' }])
      expect(mocks.getUserByEmail).toHaveBeenCalledWith('user@example.com')
    })

    const updateHook = renderHook(() => useUserUpdateInfo(), { wrapper: query.wrapper })
    await act(async () => {
      await updateHook.result.current.updateUserInfo({ username: 'new-name' })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['user'] })
  })

  it('maps video queries and invalidates caches on create/update/delete', async () => {
    mocks.videoList.mockImplementation(async (page: number, pageSize: number) => {
      if (pageSize === 9) {
        return { data: { list: [{ id: 'swiper-1' }] } }
      }

      if (pageSize === 11) {
        return { data: { list: [{ id: 'recommend-1' }] } }
      }

      if (page === 1) {
        return { data: { list: [{ id: 'random-1' }] } }
      }

      return { data: { list: [{ id: 'random-2' }] } }
    })
    mocks.videoGetDetail.mockResolvedValue({ data: { id: 'video-1', title: 'Milimili' } })
    mocks.videoListLike.mockResolvedValue({ data: [{ id: 'video-like-1' }] })
    mocks.videoListSpace.mockResolvedValue({ data: { list: [{ id: 'space-1' }], total: 1 } })
    mocks.videoShare.mockResolvedValue({ code: 0 })
    mocks.videoCreate.mockResolvedValue({ code: 0 })
    mocks.videoUpdate.mockResolvedValue({ code: 0 })
    mocks.videoDelete.mockResolvedValue({ code: 0 })

    await expect(getVideoList()).resolves.toEqual({
      videoSwiperList: [{ id: 'swiper-1' }],
    })
    await expect(getVideoDetail('video-1')).resolves.toEqual({
      videoDetail: { id: 'video-1', title: 'Milimili' },
    })

    const query = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(query.client, 'invalidateQueries')

    const listHook = renderHook(() => useVideoList(11), { wrapper: query.wrapper })
    const detailHook = renderHook(() => useVideoDetail('video-1'), { wrapper: query.wrapper })
    const likeListHook = renderHook(() => useVideoLikeList('user-1'), { wrapper: query.wrapper })
    const spaceHook = renderHook(
      () => useVideoListSpace({ userId: 'user-1', page: 1, pageSize: 20 }),
      { wrapper: query.wrapper }
    )
    const pageDisabledHook = renderHook(() => useVideoPageList({ page: 1, pageSize: 20 }), {
      wrapper: query.wrapper,
    })

    await waitFor(() => {
      expect(listHook.result.current.videoRecommendList).toEqual([{ id: 'recommend-1' }])
      expect(listHook.result.current.videoRandomList).toEqual([{ id: 'random-1' }])
      expect(detailHook.result.current.videoDetail).toEqual({ id: 'video-1', title: 'Milimili' })
      expect(likeListHook.result.current.videoLikeList).toEqual([{ id: 'video-like-1' }])
      expect(spaceHook.result.current.videoSpaceList).toEqual([{ id: 'space-1' }])
      expect(spaceHook.result.current.total).toBe(1)
      expect(pageDisabledHook.result.current.videoPageList).toEqual([])
    })

    await act(async () => {
      await listHook.result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(listHook.result.current.videoRandomList).toEqual([
        { id: 'random-1' },
        { id: 'random-2' },
      ])
    })

    const shareHook = renderHook(() => useVideoShare(), { wrapper: query.wrapper })
    const createHook = renderHook(() => useVideoCreateUpdate({ title: 'new video' }), {
      wrapper: query.wrapper,
    })
    const updateHook = renderHook(
      () => useVideoCreateUpdate({ title: 'updated video' }, 'video-1'),
      {
        wrapper: query.wrapper,
      }
    )
    const deleteHook = renderHook(() => useVideoDelete(), { wrapper: query.wrapper })

    await act(async () => {
      await shareHook.result.current.shareVideo({ videoId: 'video-1' })
      await createHook.result.current.createUpdateVideo()
      await updateHook.result.current.createUpdateVideo()
      await deleteHook.result.current.deleteVideo('video-1')
    })

    expect(mocks.videoCreate).toHaveBeenCalledWith({ title: 'new video' })
    expect(mocks.videoUpdate).toHaveBeenCalledWith('video-1', { title: 'updated video' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['video', 'list'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['video', 'space'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['video', 'detail'] })
  })
})
