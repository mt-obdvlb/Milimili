import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createExecOnlyQuery,
  createMockQuery,
  createObjectId,
} from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  CommentModel: {
    aggregate: vi.fn(),
    find: vi.fn(),
  },
  FeedModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    populate: vi.fn(),
    updateOne: vi.fn(),
  },
  FollowModel: {
    find: vi.fn(),
  },
  LikeModel: {
    aggregate: vi.fn(),
  },
  MessageModel: {
    aggregate: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    insertMany: vi.fn(),
    updateMany: vi.fn(),
  },
  UserModel: {
    find: vi.fn(),
    findById: vi.fn(),
  },
  VideoModel: {
    find: vi.fn(),
  },
  VideoStatsModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
  },
}))

const feedModelMocks = vi.hoisted(() => ({
  FeedModel: modelMocks.FeedModel,
}))

const followModelMocks = vi.hoisted(() => ({
  FollowModel: modelMocks.FollowModel,
}))

const conversationModelMocks = vi.hoisted(() => ({
  ConversationModel: {
    countDocuments: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}))

const socketMocks = vi.hoisted(() => ({
  pushNewWhisper: vi.fn(),
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
vi.mock('@/models/feed.model', () => feedModelMocks)
vi.mock('@/models/follow.model', () => followModelMocks)
vi.mock('@/models/conversation.model', () => conversationModelMocks)
vi.mock('@/socket/message', () => socketMocks)
vi.mock('@/utils', () => utilsMocks)

import { FeedService } from '@/services/feed.service'
import { MessageService } from '@/services/message.service'

describe('message/feed services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('MessageService', () => {
    it('returns unread counts for all message types', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439171')
      vi.mocked(modelMocks.MessageModel.aggregate).mockReturnValue(
        createExecOnlyQuery([
          { count: 2, type: 'like' },
          { count: 1, type: 'whisper' },
        ])
      )

      await expect(MessageService.statistics(userId.toString())).resolves.toEqual([
        { count: 2, type: 'like' },
        { count: 1, type: 'whisper' },
        { count: 0, type: 'at' },
        { count: 0, type: 'reply' },
        { count: 0, type: 'system' },
      ])
    })

    it('sends a whisper, updates both conversations and pushes a socket event', async () => {
      const senderId = createObjectId('507f1f77bcf86cd799439172')
      const receiverId = createObjectId('507f1f77bcf86cd799439173')
      await MessageService.sendWhisper({
        content: '你好',
        id: senderId.toString(),
        toId: receiverId.toString(),
      })

      expect(modelMocks.MessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '你好',
          type: 'whisper',
        })
      )
      expect(conversationModelMocks.ConversationModel.findOneAndUpdate).toHaveBeenCalledTimes(2)
      expect(socketMocks.pushNewWhisper).toHaveBeenCalledWith(receiverId.toString())
    })

    it('builds whisper conversation list output from conversation and user records', async () => {
      const toUserId = createObjectId('507f1f77bcf86cd799439091')
      const conversationId = createObjectId('507f1f77bcf86cd799439092')
      const updatedAt = new Date('2024-01-01T00:00:00.000Z')

      vi.mocked(conversationModelMocks.ConversationModel.countDocuments).mockResolvedValue(1)
      vi.mocked(conversationModelMocks.ConversationModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: conversationId,
            lastContent: '最后一条',
            toUserId,
            updatedAt,
            userId: createObjectId('507f1f77bcf86cd799439093'),
          },
        ])
      )
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: toUserId,
            avatar: 'avatar.png',
            name: '私信对象',
          },
        ])
      )

      await expect(
        MessageService.getList('507f1f77bcf86cd799439174', {
          page: 1,
          pageSize: 20,
          type: 'whisper',
        })
      ).resolves.toEqual({
        list: [
          {
            content: '最后一条',
            createdAt: updatedAt.toISOString(),
            fromUser: {
              avatar: 'avatar.png',
              id: toUserId.toString(),
              name: '私信对象',
            },
            id: conversationId.toString(),
            type: 'whisper',
          },
        ],
        total: 1,
      })
    })

    it('creates a conversation shell from the latest whisper when the target user exists', async () => {
      const toUserId = createObjectId('507f1f77bcf86cd799439094')
      vi.mocked(modelMocks.UserModel.findById).mockReturnValue(createMockQuery({ _id: toUserId }))
      vi.mocked(modelMocks.MessageModel.findOne).mockReturnValue(
        createMockQuery({
          content: '最近一条消息',
        })
      )

      await MessageService.createConversation('507f1f77bcf86cd799439175', toUserId.toString())

      expect(conversationModelMocks.ConversationModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          toUserId: expect.any(Object),
          userId: expect.any(Object),
        }),
        {
          $set: expect.objectContaining({
            lastContent: '最近一条消息',
          }),
        },
        {
          new: true,
          timestamps: true,
          upsert: true,
        }
      )
    })

    it('groups whisper messages into five-minute buckets', async () => {
      const conversationId = createObjectId('507f1f77bcf86cd799439095')
      const fromUserId = createObjectId('507f1f77bcf86cd799439096')

      vi.mocked(conversationModelMocks.ConversationModel.findOne).mockReturnValue(
        createMockQuery({
          toUserId: createObjectId('507f1f77bcf86cd799439097'),
          userId: createObjectId('507f1f77bcf86cd799439098'),
        })
      )
      vi.mocked(modelMocks.MessageModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: conversationId,
            content: '第一条',
            createdAt: new Date('2024-01-01T00:10:00.000Z'),
            fromUserId,
          },
          {
            _id: createObjectId('507f1f77bcf86cd799439099'),
            content: '第二条',
            createdAt: new Date('2024-01-01T00:01:00.000Z'),
            fromUserId,
          },
        ])
      )
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: fromUserId,
            avatar: 'avatar.png',
            name: '发送者',
          },
        ])
      )

      const result = await MessageService.getConversation(
        '507f1f77bcf86cd799439176',
        '507f1f77bcf86cd799439177'
      )

      expect(result).toHaveLength(2)
      expect(result[0]?.conversations[0]?.content).toBe('第一条')
      expect(result[1]?.conversations[0]?.content).toBe('第二条')
    })

    it('marks messages as read, creates @ messages and deletes messages', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439178')
      const fromUserId = createObjectId('507f1f77bcf86cd799439179')
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: createObjectId('507f1f77bcf86cd799439100'),
          },
          {
            _id: createObjectId('507f1f77bcf86cd799439101'),
          },
        ])
      )

      await MessageService.read(userId.toString(), 'whisper', fromUserId.toString())
      await MessageService.read(userId.toString(), 'reply', fromUserId.toString())
      await MessageService.atMessage(
        userId.toString(),
        'feed',
        createObjectId('507f1f77bcf86cd799439102'),
        '@小明 hi @小明 再见 @小红'
      )
      await MessageService.delete(userId.toString(), '507f1f77bcf86cd799439180')

      expect(modelMocks.MessageModel.updateMany).toHaveBeenCalledTimes(2)
      expect(modelMocks.MessageModel.insertMany).toHaveBeenCalledTimes(1)
      expect(modelMocks.MessageModel.deleteOne).toHaveBeenCalledWith({
        _id: expect.any(Object),
        userId: expect.any(Object),
      })
    })
  })

  describe('FeedService', () => {
    it('returns recent followed video feeds', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439103')
      const feedId = createObjectId('507f1f77bcf86cd799439104')
      const videoId = createObjectId('507f1f77bcf86cd799439105')

      const followQuery = {
        lean: vi.fn().mockResolvedValue([{ followingId: userId }]),
        select: vi.fn(),
      }
      followQuery.select.mockReturnValue(followQuery)

      const feedQuery = {
        lean: vi.fn().mockResolvedValue([
          {
            _id: feedId,
            userId: {
              _id: userId,
              avatar: 'avatar.png',
              name: 'UP 主',
            },
            videoId: {
              _id: videoId,
              publishedAt: new Date('2024-01-02T00:00:00.000Z'),
              thumbnail: 'thumb.png',
              title: '新视频',
            },
          },
        ]),
        limit: vi.fn(),
        populate: vi.fn(),
        sort: vi.fn(),
      }
      feedQuery.limit.mockReturnValue(feedQuery)
      feedQuery.populate.mockReturnValue(feedQuery)
      feedQuery.sort.mockReturnValue(feedQuery)

      vi.mocked(modelMocks.FollowModel.find).mockReturnValue(followQuery)
      vi.mocked(modelMocks.FeedModel.find).mockReturnValue(feedQuery)

      await expect(FeedService.recent(userId.toString())).resolves.toEqual([
        {
          id: feedId.toString(),
          user: {
            avatar: 'avatar.png',
            id: userId.toString(),
            name: 'UP 主',
          },
          video: {
            id: videoId.toString(),
            publishedAt: '2024-01-02T00:00:00.000Z',
            thumbnail: 'thumb.png',
            title: '新视频',
          },
        },
      ])
    })

    it('creates image-text feeds and emits @ mentions', async () => {
      const feedId = createObjectId('507f1f77bcf86cd799439106')
      const atSpy = vi.spyOn(MessageService, 'atMessage').mockResolvedValue()
      vi.mocked(modelMocks.FeedModel.create).mockResolvedValue({ _id: feedId })

      await FeedService.create('507f1f77bcf86cd799439181', {
        content: '@测试用户 你好',
        imageUrls: ['a.png'],
        title: '标题',
      })

      expect(modelMocks.FeedModel.create).toHaveBeenCalledWith({
        content: '@测试用户 你好',
        mediaUrls: ['a.png'],
        title: '标题',
        type: 'image-text',
        userId: '507f1f77bcf86cd799439181',
      })
      expect(atSpy).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439181',
        'feed',
        feedId,
        '@测试用户 你好'
      )
    })

    it('maps feed list results with linked video stats and top comments', async () => {
      const feedId = createObjectId('507f1f77bcf86cd799439107')
      const videoId = createObjectId('507f1f77bcf86cd799439108')
      const userId = createObjectId('507f1f77bcf86cd799439109')

      vi.mocked(modelMocks.FeedModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: feedId,
            commentsCount: 2,
            content: '动态内容',
            likesCount: 3,
            mediaUrls: ['a.png'],
            publishedAt: new Date('2024-01-03T00:00:00.000Z'),
            title: '动态标题',
            type: 'video',
            userId: {
              _id: userId,
              avatar: 'avatar.png',
              name: 'UP 主',
            },
            videoId: {
              _id: videoId,
              description: '简介',
              thumbnail: 'thumb.png',
              time: 120,
              title: '视频标题',
              url: '/video',
            },
          },
        ])
      )
      vi.mocked(modelMocks.FeedModel.countDocuments).mockResolvedValue(1)
      vi.mocked(modelMocks.VideoStatsModel.find).mockReturnValue(
        createMockQuery([
          {
            commentsCount: 2,
            danmakusCount: 4,
            favoritesCount: 5,
            likesCount: 6,
            sharesCount: 7,
            videoId,
            viewsCount: 8,
          },
        ])
      )
      vi.mocked(modelMocks.CommentModel.aggregate).mockResolvedValue([
        {
          _id: feedId,
          topComment: '置顶评论',
        },
      ])

      await expect(
        FeedService.list('current-user', {
          page: 1,
          pageSize: 20,
          type: 'all',
          userId: userId.toString(),
        })
      ).resolves.toEqual({
        list: [
          {
            comment: '置顶评论',
            comments: 2,
            content: '动态内容',
            id: feedId.toString(),
            images: ['a.png'],
            likes: 3,
            publishedAt: '2024-01-03T00:00:00.000Z',
            referenceId: undefined,
            title: '动态标题',
            type: 'video',
            user: {
              avatar: 'avatar.png',
              id: userId.toString(),
              name: 'UP 主',
            },
            video: {
              danmakus: 4,
              description: '简介',
              id: videoId.toString(),
              thumbnail: 'thumb.png',
              time: 120,
              title: '视频标题',
              url: '/video',
              views: 8,
            },
          },
        ],
        total: 1,
      })
    })

    it('returns a feed detail with reference count and video stats', async () => {
      const feedId = createObjectId('507f1f77bcf86cd799439110')
      const videoId = createObjectId('507f1f77bcf86cd799439111')
      const userId = createObjectId('507f1f77bcf86cd799439112')

      vi.mocked(modelMocks.FeedModel.findById).mockReturnValue(
        createMockQuery({
          _id: feedId,
          commentsCount: 2,
          content: '动态内容',
          likesCount: 3,
          mediaUrls: ['a.png'],
          publishedAt: new Date('2024-01-04T00:00:00.000Z'),
          title: '动态标题',
          type: 'video',
          userId: {
            _id: userId,
            avatar: 'avatar.png',
            name: 'UP 主',
          },
          videoId: {
            _id: videoId,
            description: '简介',
            thumbnail: 'thumb.png',
            time: 180,
            title: '视频标题',
            url: '/video',
          },
        })
      )
      vi.mocked(modelMocks.VideoStatsModel.findOne).mockReturnValue(
        createMockQuery({
          commentsCount: 2,
          danmakusCount: 4,
          favoritesCount: 5,
          likesCount: 6,
          sharesCount: 7,
          viewsCount: 8,
        })
      )
      vi.mocked(modelMocks.FeedModel.countDocuments).mockReturnValue(createMockQuery(9))

      await expect(FeedService.getById({ id: feedId.toString() })).resolves.toEqual({
        comments: 2,
        content: '动态内容',
        id: feedId.toString(),
        images: ['a.png'],
        likes: 3,
        publishedAt: '2024-01-04T00:00:00.000Z',
        referenceId: undefined,
        references: 9,
        title: '动态标题',
        type: 'video',
        user: {
          avatar: 'avatar.png',
          id: userId.toString(),
          name: 'UP 主',
        },
        video: {
          danmakus: 4,
          description: '简介',
          id: videoId.toString(),
          thumbnail: 'thumb.png',
          time: 180,
          title: '视频标题',
          url: '/video',
          views: 8,
        },
      })
    })

    it('transponts referenced feeds and merges likes with transponts', async () => {
      const originalId = createObjectId('507f1f77bcf86cd799439113')
      const targetVideoId = createObjectId('507f1f77bcf86cd799439114')
      const userId = createObjectId('507f1f77bcf86cd799439182')
      const atSpy = vi.spyOn(MessageService, 'atMessage').mockResolvedValue()

      vi.mocked(modelMocks.FeedModel.findById)
        .mockResolvedValueOnce({
          _id: originalId,
          referenceId: createObjectId('507f1f77bcf86cd799439115'),
          type: 'reference',
        })
        .mockResolvedValueOnce({
          _id: originalId,
          isOpen: true,
          type: 'video',
          videoId: targetVideoId,
        })
      vi.mocked(modelMocks.LikeModel.aggregate).mockReturnValue(
        createExecOnlyQuery([
          {
            createdAt: new Date('2024-01-05T00:10:00.000Z'),
            type: 'like',
            user: {
              avatar: '1.png',
              id: createObjectId('507f1f77bcf86cd799439116'),
              name: '点赞用户',
            },
          },
        ])
      )
      vi.mocked(modelMocks.FeedModel.aggregate).mockReturnValue(
        createExecOnlyQuery([
          {
            createdAt: new Date('2024-01-05T00:00:00.000Z'),
            type: 'transpont',
            user: {
              avatar: '2.png',
              id: createObjectId('507f1f77bcf86cd799439117'),
              name: '转发用户',
            },
          },
        ])
      )

      await FeedService.transpont(userId.toString(), {
        content: '转发一下',
        feedId: originalId.toString(),
      })

      await expect(
        FeedService.listLikeTranspont(originalId.toString(), {
          page: 1,
          pageSize: 20,
        })
      ).resolves.toEqual({
        list: [
          {
            type: 'like',
            user: {
              avatar: '1.png',
              id: '507f1f77bcf86cd799439116',
              name: '点赞用户',
            },
          },
          {
            type: 'transpont',
            user: {
              avatar: '2.png',
              id: '507f1f77bcf86cd799439117',
              name: '转发用户',
            },
          },
        ],
        total: 2,
      })
      expect(atSpy).toHaveBeenCalledWith(userId.toString(), 'feed', originalId, '转发一下')
      expect(modelMocks.VideoStatsModel.updateOne).toHaveBeenCalledWith(
        { videoId: targetVideoId },
        { $inc: { sharesCount: 1 } }
      )
    })
  })
})
