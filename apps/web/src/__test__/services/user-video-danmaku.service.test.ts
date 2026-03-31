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
    loginUser({ account: 'test@example.com', password: 'secret' })
    expectRequestCalled('post', '/users/login', {
      account: 'test@example.com',
      password: 'secret',
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
      password: 'new-secret',
      code: '123456',
    })
    expect(mockRequest.put).toHaveBeenNthCalledWith(1, '/users/find-password', {
      email: 'user@example.com',
      password: 'new-secret',
      code: '123456',
    })

    getUserByName('milimili')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/users/name?name=milimili')

    getUserAtList({ keyword: 'mi', page: 1, pageSize: 10 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/users/at', {
      params: { keyword: 'mi', page: 1, pageSize: 10 },
    })

    updateUser({ username: 'new-name' })
    expect(mockRequest.put).toHaveBeenNthCalledWith(2, '/users/', {
      username: 'new-name',
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

    videoGetWatchLater({ page: 1, pageSize: 10 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(2, '/videos/watch-later', {
      params: { page: 1, pageSize: 10 },
    })

    videoGetDetail('video-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(3, '/videos/detail/video-1')

    videoShare({ videoId: 'video-1' })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/videos/share', {
      videoId: 'video-1',
    })

    videoListLike('user-1')
    expect(mockRequest.get).toHaveBeenNthCalledWith(4, '/videos/list-like/user-1')

    videoListSpace({ userId: 'user-1', page: 1, pageSize: 20 })
    expect(mockRequest.get).toHaveBeenNthCalledWith(5, '/videos/list-space', {
      params: { userId: 'user-1', page: 1, pageSize: 20 },
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

    danmakuAdd({ videoId: 'video-1', content: '2333', time: 12 })
    expect(mockRequest.post).toHaveBeenNthCalledWith(1, '/videos/danmakus', {
      videoId: 'video-1',
      content: '2333',
      time: 12,
    })
  })
})
