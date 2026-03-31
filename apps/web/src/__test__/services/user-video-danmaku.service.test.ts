import { describe, expect, it, vi } from 'vitest'
import { expectRequestCalled, mockRequest } from '@/__test__/utils/request.mock'

vi.mock('@/lib/request', () => ({
  default: mockRequest,
}))

import { danmakuAdd, danmakuGet } from '@/services/danmaku'
import {
  getUser,
  getUserAtList,
  getUserByEmail,
  getUserById,
  getUserByName,
  loginUser,
  logoutUser,
  updateUser,
  userFindPassword,
  userGetHomeInfo,
} from '@/services/user'
import {
  videoCreate,
  videoDelete,
  videoGetDetail,
  videoGetWatchLater,
  videoList,
  videoListLike,
  videoListSpace,
  videoShare,
  videoUpdate,
} from '@/services/video'

describe('web services: user/video/danmaku', () => {
  it('requests user endpoints', () => {
    loginUser({ email: 'test@example.com', password: 'secret123A!' })
    expectRequestCalled('post', '/users/login', {
      email: 'test@example.com',
      password: 'secret123A!',
    })

    logoutUser()
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/users/logout')

    getUser()
    expect(mockRequest.get).toHaveBeenNthCalledWith(1, '/users/info')

    userGetHomeInfo()
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/users/info/home')

    getUserByEmail('user@example.com')
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/users/email?email=user@example.com')

    userFindPassword({
      email: 'user@example.com',
      confirmPassword: 'New-secret1!',
      password: 'New-secret1!',
      code: '123456',
    })
    expect(mockRequest.put).toHaveBeenNthCalledWith(1, '/users/find-password', {
      email: 'user@example.com',
      confirmPassword: 'New-secret1!',
      password: 'New-secret1!',
      code: '123456',
    })

    getUserByName('milimili')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/users/name?name=milimili')

    getUserAtList({ keyword: 'mi', page: 1, pageSize: 10 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/users/at', {
      params: { keyword: 'mi', page: 1, pageSize: 10 },
    })

    updateUser({
      avatar: 'https://example.com/avatar.png',
      name: 'new-name',
    })
    expect(mockRequest.put).toHaveBeenNthCalledWith(2, '/users/', {
      avatar: 'https://example.com/avatar.png',
      name: 'new-name',
    })

    getUserById('user-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(6, '/users/id/user-1')
  })

  it('requests video endpoints', () => {
    videoList(2, 12, 'user-1')
    expectRequestCalled('get', '/videos/list', {
      params: {
        page: 2,
        pageSize: 12,
        userId: 'user-1',
      },
    })

    videoGetWatchLater({ addAt: 'all', sort: 'latest', time: 'all', type: 'all' })
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/videos/watch-later', {
      params: { addAt: 'all', sort: 'latest', time: 'all', type: 'all' },
    })

    videoGetDetail('video-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/videos/detail/video-1')

    videoShare({ videoId: 'video-1' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/videos/share', {
      videoId: 'video-1',
    })

    videoListLike('user-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/videos/list-like/user-1')

    videoListSpace({ userId: 'user-1', page: 1, pageSize: 20, sort: 'publishedAt' })
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/videos/list-space', {
      params: { userId: 'user-1', page: 1, pageSize: 20, sort: 'publishedAt' },
    })

    videoCreate({ title: '新视频' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(2, '/videos/', {
      title: '新视频',
    })

    videoUpdate('video-1', { title: '更新标题' })
    expect(mockRequest.put).toHaveBeenNthCalledWith(1, '/videos/video-1', {
      title: '更新标题',
    })

    videoDelete('video-1')
    expect(mockRequest.delete).toHaveBeenNthCalledWith(1, '/videos/video-1')
  })

  it('requests danmaku endpoints', () => {
    danmakuGet('video-1')
    expectRequestCalled('get', '/videos/danmakus/video-1')

    danmakuAdd({
      color: '#FFFFFF',
      content: '2333',
      fontSize: 24,
      position: 'scroll',
      videoId: 'video-1',
      time: 12,
    })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/videos/danmakus', {
      color: '#FFFFFF',
      content: '2333',
      fontSize: 24,
      position: 'scroll',
      videoId: 'video-1',
      time: 12,
    })
  })
})
