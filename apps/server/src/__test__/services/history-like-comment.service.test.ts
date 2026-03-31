import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MESSAGE } from '@/constants'
import {
  createExecOnlyQuery,
  createMockQuery,
  createObjectId,
} from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  CommentModel: {
    aggregate: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
  },
  FavoriteModel: {
    collection: { name: 'favorites' },
  },
  FeedModel: {
    findById: vi.fn(),
    updateOne: vi.fn(),
  },
  HistoryModel: {
    aggregate: vi.fn(),
    deleteMany: vi.fn(),
    find: vi.fn(),
    updateOne: vi.fn(),
  },
  LikeModel: {
    create: vi.fn(),
    deleteOne: vi.fn(),
    exists: vi.fn(),
    findOne: vi.fn(),
  },
  MessageModel: {
    create: vi.fn(),
  },
  UserModel: {
    collection: { name: 'users' },
  },
  VideoModel: {
    collection: { name: 'videos' },
    findById: vi.fn(),
  },
  VideoStatsModel: {
    updateOne: vi.fn(),
  },
}))

const messageServiceMocks = vi.hoisted(() => ({
  MessageService: {
    atMessage: vi.fn(),
  },
}))

const utilsMocks = vi.hoisted(() => ({
  HttpError: class HttpError extends Error {
    statusCode: number

    constructor(statusCode: number, message: string) {
      super(message)
      this.statusCode = statusCode
    }
  },
}))

vi.mock('@/models', () => modelMocks)
vi.mock('@/services/message.service', () => messageServiceMocks)
vi.mock('@/utils', () => utilsMocks)

import { CommentService } from '@/services/comment.service'
import { HistoryService } from '@/services/history.service'
import { LikeService } from '@/services/like.service'

describe('history/like/comment services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('HistoryService', () => {
    it('groups history items into today, yesterday, last week and older buckets', async () => {
      const now = new Date()
      const videoId = createObjectId('507f1f77bcf86cd799439031')
      const userId = createObjectId('507f1f77bcf86cd799439032')

      vi.mocked(modelMocks.HistoryModel.find).mockReturnValue(
        createMockQuery([
          {
            duration: 10,
            userId: { _id: userId, name: '今天' },
            videoId: { _id: videoId, thumbnail: '1.png', time: 100, title: '今日视频' },
            watchedAt: new Date(now.getTime() - 60 * 1000),
          },
          {
            duration: 20,
            userId: { _id: userId, name: '昨天' },
            videoId: { _id: videoId, thumbnail: '2.png', time: 200, title: '昨日视频' },
            watchedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
          {
            duration: 30,
            userId: { _id: userId, name: '上周' },
            videoId: { _id: videoId, thumbnail: '3.png', time: 300, title: '上周视频' },
            watchedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            duration: 40,
            userId: { _id: userId, name: '更早' },
            videoId: { _id: videoId, thumbnail: '4.png', time: 400, title: '旧视频' },
            watchedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          },
        ])
      )

      const result = await HistoryService.list({
        page: 1,
        pageSize: 20,
        userId: userId.toString(),
      })

      expect(result.todayList).toHaveLength(1)
      expect(result.yesterdayList).toHaveLength(1)
      expect(result.lastWeekList).toHaveLength(1)
      expect(result.olderList).toHaveLength(1)
    })

    it('upserts history progress when adding an item', async () => {
      await HistoryService.add({
        duration: 120,
        userId: 'user-1',
        videoId: 'video-1',
      })

      expect(modelMocks.HistoryModel.updateOne).toHaveBeenCalledWith(
        { userId: 'user-1', videoId: 'video-1' },
        expect.objectContaining({ duration: 120, watchedAt: expect.any(Date) }),
        { upsert: true }
      )
    })

    it('deletes selected history rows and clears everything for one user', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439151')
      await HistoryService.deleteBatch({
        userId: userId.toString(),
        videoIds: ['507f1f77bcf86cd799439152', '507f1f77bcf86cd799439153'],
      })
      await HistoryService.clear({ userId: userId.toString() })

      expect(modelMocks.HistoryModel.deleteMany).toHaveBeenNthCalledWith(1, {
        userId: userId.toString(),
        videoId: { $in: [expect.any(Object), expect.any(Object)] },
      })
      expect(modelMocks.HistoryModel.deleteMany).toHaveBeenNthCalledWith(2, {
        userId: userId.toString(),
      })
    })

    it('maps aggregate history search results to list output', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439033')
      const videoId = createObjectId('507f1f77bcf86cd799439034')
      const watchedAt = new Date('2024-02-03T04:05:06.000Z')

      vi.mocked(modelMocks.HistoryModel.aggregate).mockReturnValue(
        createExecOnlyQuery([
          {
            data: [
              {
                _id: createObjectId('507f1f77bcf86cd799439035'),
                duration: 45,
                isFavorite: true,
                user: { _id: userId, name: '作者' },
                video: {
                  _id: videoId,
                  thumbnail: 'thumb.png',
                  time: 99,
                  title: '搜索视频',
                  url: '/video/1',
                },
                watchedAt,
              },
            ],
            total: [{ count: 1 }],
          },
        ])
      )

      await expect(
        HistoryService.get('507f1f77bcf86cd799439154', {
          kw: '搜',
          page: 1,
          pageSize: 10,
          time: 'all',
          watchAt: 'all',
        })
      ).resolves.toEqual({
        list: [
          {
            duration: 45,
            isFavorite: true,
            thumbnail: 'thumb.png',
            time: 99,
            title: '搜索视频',
            url: '/video/1',
            userId: userId.toString(),
            username: '作者',
            videoId: videoId.toString(),
            watchAt: watchedAt.toISOString(),
          },
        ],
        total: 1,
      })
    })
  })

  describe('LikeService', () => {
    it('creates a like and a notification for a video target', async () => {
      const ownerId = createObjectId('507f1f77bcf86cd799439036')
      const videoId = createObjectId('507f1f77bcf86cd799439037')
      const userId = createObjectId('507f1f77bcf86cd799439155')

      vi.mocked(modelMocks.VideoModel.findById).mockReturnValue(
        createMockQuery({
          _id: videoId,
          userId: ownerId,
        })
      )
      vi.mocked(modelMocks.LikeModel.findOne).mockResolvedValue(null)

      await LikeService.like(userId.toString(), { videoId: videoId.toString() })

      expect(modelMocks.VideoStatsModel.updateOne).toHaveBeenCalledWith(
        { videoId: expect.any(Object) },
        { $inc: { likesCount: 1 } }
      )
      expect(modelMocks.LikeModel.create).toHaveBeenCalled()
      expect(modelMocks.MessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceId: videoId,
          sourceType: 'video',
          type: 'like',
          userId: ownerId,
        })
      )
    })

    it('throws when a like already exists', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439156')
      const videoId = createObjectId('507f1f77bcf86cd799439157')
      vi.mocked(modelMocks.VideoModel.findById).mockReturnValue(
        createMockQuery({
          _id: createObjectId('507f1f77bcf86cd799439038'),
          userId: createObjectId('507f1f77bcf86cd799439039'),
        })
      )
      vi.mocked(modelMocks.LikeModel.findOne).mockResolvedValue({ _id: createObjectId() })

      await expect(
        LikeService.like(userId.toString(), { videoId: videoId.toString() })
      ).rejects.toThrow(MESSAGE.LIKE_EXIST)
    })

    it('deletes likes and returns 1 when the target is missing in isLike', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439158')
      const feedId = createObjectId('507f1f77bcf86cd799439159')
      const missingCommentId = createObjectId('507f1f77bcf86cd799439160')
      vi.mocked(modelMocks.FeedModel.findById).mockReturnValue(
        createMockQuery({
          _id: createObjectId('507f1f77bcf86cd799439040'),
          userId: createObjectId('507f1f77bcf86cd799439041'),
        })
      )

      await LikeService.unlike(userId.toString(), { feedId: feedId.toString() })

      vi.mocked(modelMocks.CommentModel.findById).mockReturnValue(createMockQuery(null))

      await expect(
        LikeService.isLike(userId.toString(), { commentId: missingCommentId.toString() })
      ).resolves.toBe(1)
      expect(modelMocks.LikeModel.deleteOne).toHaveBeenCalled()
    })
  })

  describe('CommentService', () => {
    it('returns aggregated comments for a video target', async () => {
      const videoId = createObjectId('507f1f77bcf86cd799439042')
      const createdAt = new Date('2024-01-01T00:00:00.000Z')

      vi.mocked(modelMocks.VideoModel.findById).mockReturnValue(
        createMockQuery({
          _id: videoId,
          userId: createObjectId('507f1f77bcf86cd799439043'),
        })
      )
      vi.mocked(modelMocks.CommentModel.aggregate).mockResolvedValue([
        {
          data: [
            {
              comments: 1,
              content: '评论内容',
              createdAt,
              hotScore: 2,
              id: 'comment-1',
              likes: 1,
              type: 'video',
              user: {
                avatar: 'avatar.png',
                id: 'user-1',
                name: '作者',
              },
            },
          ],
          metadata: [{ total: 1 }],
        },
      ])

      await expect(
        CommentService.get({
          page: 1,
          pageSize: 20,
          sort: 'hot',
          videoId: videoId.toString(),
        })
      ).resolves.toEqual({
        list: [
          {
            comments: 1,
            content: '评论内容',
            createdAt,
            hotScore: 2,
            id: 'comment-1',
            likes: 1,
            type: 'video',
            user: {
              avatar: 'avatar.png',
              id: 'user-1',
              name: '作者',
            },
          },
        ],
        total: 1,
      })
    })

    it('creates a top-level video comment and notifies both mention and reply targets', async () => {
      const ownerId = createObjectId('507f1f77bcf86cd799439044')
      const videoId = createObjectId('507f1f77bcf86cd799439045')
      const commentId = createObjectId('507f1f77bcf86cd799439046')
      const userId = createObjectId('507f1f77bcf86cd799439161')

      vi.mocked(modelMocks.VideoModel.findById).mockReturnValue(
        createMockQuery({
          _id: videoId,
          userId: ownerId,
        })
      )
      vi.mocked(modelMocks.CommentModel.create).mockResolvedValue({
        _id: commentId,
      })

      await CommentService.comment(userId.toString(), {
        content: '@测试用户 你好',
        videoId: videoId.toString(),
      })

      expect(modelMocks.VideoStatsModel.updateOne).toHaveBeenCalledWith(
        { _id: videoId },
        { $inc: { commentsCount: 1 } }
      )
      expect(messageServiceMocks.MessageService.atMessage).toHaveBeenCalledWith(
        userId.toString(),
        'comment',
        commentId,
        '@测试用户 你好'
      )
      expect(modelMocks.MessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '@测试用户 你好',
          sourceId: videoId,
          sourceType: 'video',
          type: 'reply',
          userId: ownerId,
        })
      )
    })

    it('deletes nested comment trees recursively', async () => {
      const rootId = createObjectId('507f1f77bcf86cd799439047')
      const childId = createObjectId('507f1f77bcf86cd799439048')
      vi.mocked(modelMocks.CommentModel.findOne)
        .mockResolvedValueOnce({
          _id: rootId,
          targetId: createObjectId('507f1f77bcf86cd799439049'),
          targetType: 'video',
          userId: 'user-1',
        })
        .mockResolvedValueOnce({
          _id: childId,
          targetId: rootId,
          targetType: 'comment',
          userId: createObjectId('507f1f77bcf86cd799439050').toString(),
        })
      vi.mocked(modelMocks.CommentModel.find)
        .mockResolvedValueOnce([
          {
            _id: childId,
            userId: createObjectId('507f1f77bcf86cd799439050'),
          },
        ])
        .mockResolvedValueOnce([])

      await CommentService.delete('user-1', { id: rootId.toString() })

      expect(modelMocks.CommentModel.deleteOne).toHaveBeenNthCalledWith(1, {
        _id: rootId.toString(),
      })
      expect(modelMocks.CommentModel.deleteOne).toHaveBeenNthCalledWith(2, {
        _id: childId.toString(),
      })
      expect(modelMocks.VideoStatsModel.updateOne).toHaveBeenCalled()
    })

    it('rejects empty comment content', async () => {
      await expect(
        CommentService.comment('user-1', {
          content: '   ',
          videoId: 'video-1',
        })
      ).rejects.toThrow(MESSAGE.INVALID_PARAMS)
    })
  })
})
