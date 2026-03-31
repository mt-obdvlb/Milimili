import { describe, expect, it, vi } from 'vitest'
import { expectRequestCalled, mockRequest } from '@/__test__/utils/request.mock'

vi.mock('@/lib/request', () => ({
  default: mockRequest,
}))

import {
  favoriteAddBatch,
  favoriteAddFolder,
  favoriteCleanWatchLater,
  favoriteDeleteBatch,
  favoriteDeleteFolder,
  favoriteGetByVideoId,
  favoriteGetDetail,
  favoriteGetFolderList,
  favoriteGetRecent,
  favoriteIsWatchLater,
  favoriteList,
  favoriteMoveBatch,
  favoriteToggleWatchLater,
  favoriteUpdateFolder,
} from '@/services/favorite'
import {
  feedDelete,
  feedGetById,
  feedGetFollowing,
  feedGetRecent,
  feedList,
  feedListLikeTranspont,
  feedPublish,
  feedTranspont,
} from '@/services/feed'
import {
  messageCreateConversation,
  messageDelete,
  messageDeleteConversation,
  messageGetConversation,
  messageGetList,
  messageGetStatistics,
  messageRead,
  messageSendWhisper,
} from '@/services/message'

describe('web services: favorite/feed/message', () => {
  it('requests favorite endpoints with the current path contract', () => {
    favoriteGetRecent()
    expectRequestCalled('get', '/favorites/recent')

    favoriteGetFolderList()
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/favorites/folder/')

    favoriteGetFolderList('user-2')
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/favorites/folder/user-2')

    favoriteDeleteBatch({ ids: ['fav-1'] })
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/favorites/', {
      data: { ids: ['fav-1'] },
    })

    favoriteAddBatch({ favoriteFolderId: 'folder-1', videoIds: ['video-1'] })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/favorites/batch', {
      favoriteFolderId: 'folder-1',
      videoIds: ['video-1'],
    })

    favoriteMoveBatch({
      sourceFolderId: 'folder-1',
      targetFolderId: 'folder-2',
      videoIds: ['video-1'],
    })
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/favorites/move-batch', {
      sourceFolderId: 'folder-1',
      targetFolderId: 'folder-2',
      videoIds: ['video-1'],
    })

    favoriteCleanWatchLater()
    expect(mockRequest.post).toHaveBeenNthCalledWith(3, '/favorites/clean-watch-later')

    favoriteAddFolder({ name: '稍后再看' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(4, '/favorites/folder', {
      name: '稍后再看',
    })

    favoriteGetByVideoId('video-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/favorites/videoId/video-1')

    favoriteGetDetail('folder-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/favorites/detail/folder-1')

    favoriteList({ favoriteFolderId: 'folder-1', page: 1, pageSize: 20 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(6, '/favorites', {
      params: { favoriteFolderId: 'folder-1', page: 1, pageSize: 20 },
    })

    favoriteDeleteFolder('folder-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(2, '/favorites/folder/folder-1')

    favoriteUpdateFolder({ id: 'folder-1', body: { name: '新的名字' } })
    expect(mockRequest.put).toHaveBeenNthCalledWith(1, '/favorites/folder/folder-1', {
      name: '新的名字',
    })

    favoriteToggleWatchLater('video-1')
    expect(mockRequest.put).toHaveBeenNthCalledWith(2, '/favorites/watch-later/video-1')

    favoriteIsWatchLater('video-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(7, '/favorites/watch-later/video-1')
  })

  it('requests feed endpoints', () => {
    feedGetRecent()
    expectRequestCalled('get', '/feeds/recent')

    feedGetFollowing()
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/feeds/following')

    feedPublish({ content: 'hello' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/feeds/', { content: 'hello' })

    feedList({ page: 1, pageSize: 10, type: 'all', userId: 'user-1' })
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/feeds/', {
      params: { page: 1, pageSize: 10, type: 'all', userId: 'user-1' },
    })

    feedGetById('feed-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/feeds/feed-1')

    feedDelete('feed-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/feeds/feed-1')

    feedTranspont({ feedId: 'feed-1', content: '转发一下' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/feeds/transpont', {
      feedId: 'feed-1',
      content: '转发一下',
    })

    feedListLikeTranspont('feed-1', { page: 2, pageSize: 10 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/feeds/feed-1/like-transpont', {
      params: { page: 2, pageSize: 10 },
    })
  })

  it('requests message endpoints', () => {
    messageGetStatistics()
    expectRequestCalled('get', '/messages/statistics')

    messageGetList({ page: 1, pageSize: 10, type: 'reply' })
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/messages/', {
      params: { page: 1, pageSize: 10, type: 'reply' },
    })

    messageSendWhisper({ content: '你好', receiverId: 'user-2' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/messages/send-whisper', {
      content: '你好',
      receiverId: 'user-2',
    })

    messageDelete('message-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/messages/message-1')

    messageRead({ type: 'reply' })
    expect(mockRequest.put).toHaveBeenNthCalledWith(1, '/messages/read', {
      type: 'reply',
    })

    messageRead({ userId: 'user-2', type: 'reply' })
    expect(mockRequest.put).toHaveBeenNthCalledWith(2, '/messages/read/user-2', {
      type: 'reply',
    })

    messageGetConversation('user-2')
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/messages/conversation/user-2')

    messageCreateConversation('user-2')
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/messages/conversation/user-2')

    messageDeleteConversation('conversation-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(2, '/messages/conversation/conversation-1')
  })
})
