import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createLeanExecQuery,
  createMockQuery,
  createObjectId,
} from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  DanmakuModel: {
    create: vi.fn(),
    find: vi.fn(),
  },
  FavoriteFolderModel: {
    findOne: vi.fn(),
  },
  FavoriteModel: {
    deleteMany: vi.fn(),
    find: vi.fn(),
  },
  FeedModel: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
  },
  FollowModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
  },
  HistoryModel: {
    deleteMany: vi.fn(),
    find: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
  LikeModel: {
    find: vi.fn(),
  },
  SearchLogModel: {},
  TagModel: {
    find: vi.fn(),
  },
  UserModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
  },
  VideoModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    distinct: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOneAndDelete: vi.fn(),
    updateOne: vi.fn(),
  },
  VideoStatsModel: {
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOneAndUpdate: vi.fn(),
    updateMany: vi.fn(),
    updateOne: vi.fn(),
  },
}))

const feedModelMocks = vi.hoisted(() => ({
  FeedModel: modelMocks.FeedModel,
}))

const messageServiceMocks = vi.hoisted(() => ({
  MessageService: {
    atMessage: vi.fn(),
  },
}))

const feedServiceMocks = vi.hoisted(() => ({
  FeedService: {
    transpont: vi.fn(),
  },
}))

vi.mock('@/models', () => modelMocks)
vi.mock('@/models/feed.model', () => feedModelMocks)
vi.mock('@/services/message.service', () => messageServiceMocks)
vi.mock('@/services/feed.service', () => feedServiceMocks)

import { SearchService } from '@/services/search.service'
import { VideoService } from '@/services/video.service'

describe('search/video services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(modelMocks.VideoModel.aggregate).mockReset()
    vi.mocked(modelMocks.UserModel.find).mockReset()
    vi.mocked(modelMocks.UserModel.aggregate).mockReset()
    vi.mocked(modelMocks.FollowModel.aggregate).mockReset()
    vi.mocked(modelMocks.VideoModel.countDocuments).mockReset()
    vi.mocked(modelMocks.FollowModel.countDocuments).mockReset()
  })

  describe('SearchService', () => {
    it('returns video items plus a recommended user block on the first all-page', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439121')
      const videoId = createObjectId('507f1f77bcf86cd799439122')

      vi.mocked(modelMocks.VideoModel.aggregate)
        .mockResolvedValueOnce([
          {
            _id: videoId,
            danmakus: 8,
            publishedAt: new Date('2024-01-01T00:00:00.000Z'),
            thumbnail: 'thumb.png',
            time: 120,
            title: '搜索视频',
            url: '/video',
            userAvatar: 'avatar.png',
            userId,
            userName: 'UP 主',
            views: 9,
          },
        ])
        .mockResolvedValueOnce([{ count: 1 }])
        .mockResolvedValueOnce([
          {
            _id: userId,
            count: 5,
          },
        ])
        .mockResolvedValueOnce([
          {
            _id: videoId,
            danmakus: 3,
            publishedAt: new Date('2024-01-02T00:00:00.000Z'),
            thumbnail: 'rec.png',
            time: 60,
            title: '推荐视频',
            url: '/video/rec',
            views: 10,
          },
        ])
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: userId,
            avatar: 'avatar.png',
            name: 'UP 主',
          },
        ])
      )
      vi.mocked(modelMocks.UserModel.countDocuments).mockResolvedValue(1)
      vi.mocked(modelMocks.VideoModel.distinct).mockResolvedValue([userId])
      vi.mocked(modelMocks.FollowModel.aggregate).mockResolvedValue([{ _id: userId, count: 11 }])
      vi.mocked(modelMocks.VideoModel.countDocuments).mockResolvedValue(5)
      vi.mocked(modelMocks.FollowModel.countDocuments).mockResolvedValue(11)
      vi.mocked(modelMocks.UserModel.aggregate).mockResolvedValue([
        {
          _id: userId,
          avatar: 'avatar.png',
          name: '推荐用户',
        },
      ])

      const result = await SearchService.get({
        kw: '视频',
        page: 1,
        publishedAt: 'all',
        sort: 'all',
        time: 'all',
        type: 'all',
      })

      expect(result.list.list).toHaveLength(1)
      expect(result.user?.user.id).toBe(userId.toString())
    })
  })

  describe('VideoService', () => {
    it('returns randomized video cards based on aggregate samples', async () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)
      vi.mocked(modelMocks.VideoModel.aggregate).mockResolvedValue([
        {
          id: 'video-1',
          title: '随机视频',
        },
      ])

      await expect(VideoService.list({ page: 1, pageSize: 2 })).resolves.toEqual([
        { id: 'video-1', title: '随机视频' },
        { id: 'video-1', title: '随机视频' },
      ])

      randomSpy.mockRestore()
    })

    it('creates a new video, stats row and feed row for uploads', async () => {
      const videoId = createObjectId('507f1f77bcf86cd799439123')
      const feedId = createObjectId('507f1f77bcf86cd799439124')
      vi.mocked(modelMocks.UserModel.findById).mockResolvedValue({ _id: createObjectId() })
      vi.mocked(modelMocks.VideoModel.create).mockResolvedValue({
        _id: videoId,
        commentsDisabled: false,
        description: '简介',
        isOpen: true,
        publishedAt: new Date('2024-01-01T00:00:00.000Z'),
        title: '新视频',
      })
      vi.mocked(modelMocks.FeedModel.create).mockResolvedValue({ _id: feedId })

      await VideoService.createOrUpdate(
        {
          categoryId: '507f1f77bcf86cd799439188',
          commentsDisabled: false,
          danmakuDisabled: false,
          description: '简介',
          isOpen: true,
          publishedAt: new Date('2024-01-01T00:00:00.000Z'),
          sourceType: 'original',
          status: 'published',
          thumbnail: 'thumb.png',
          time: 120,
          title: '新视频',
          url: 'https://example.com/video',
        },
        'user-1'
      )

      expect(modelMocks.VideoStatsModel.create).toHaveBeenCalledWith({ videoId })
      expect(messageServiceMocks.MessageService.atMessage).toHaveBeenCalledWith(
        'user-1',
        'video',
        feedId,
        '简介'
      )
    })

    it('maps danmaku rows and adds a new danmaku with sender info', async () => {
      const videoId = createObjectId('507f1f77bcf86cd799439125')
      const userId = createObjectId('507f1f77bcf86cd799439126')
      const danmakuId = createObjectId('507f1f77bcf86cd799439127')
      const createdAt = new Date('2024-01-01T00:00:00.000Z')

      vi.mocked(modelMocks.VideoModel.findById)
        .mockReturnValueOnce(createMockQuery({ _id: videoId }))
        .mockResolvedValueOnce({ _id: videoId })
      vi.mocked(modelMocks.DanmakuModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: danmakuId,
            color: undefined,
            content: '弹幕',
            createdAt,
            fontSize: undefined,
            position: 'scroll',
            sender: { avatar: 'avatar.png', name: '发送者', userId: userId.toString() },
            time: 12,
            videoId,
          },
        ])
      )
      vi.mocked(modelMocks.UserModel.findById).mockReturnValue(
        createMockQuery({
          _id: userId,
          avatar: 'avatar.png',
          name: '发送者',
        })
      )
      vi.mocked(modelMocks.DanmakuModel.create).mockResolvedValue({
        _id: danmakuId,
        color: '#00FF00',
        content: '新弹幕',
        createdAt,
        fontSize: 30,
        position: 'top',
        sender: { avatar: 'avatar.png', name: '发送者', userId: userId.toString() },
        time: 18,
        videoId,
      })

      await expect(VideoService.getDanmakus(videoId.toString())).resolves.toHaveLength(1)
      await expect(
        VideoService.addDanmaku({
          color: '#00FF00',
          content: '新弹幕',
          fontSize: 30,
          position: 'top',
          time: 18,
          userId: userId.toString(),
          videoId: videoId.toString(),
        })
      ).resolves.toEqual(
        expect.objectContaining({
          id: danmakuId.toString(),
          sender: {
            avatar: 'avatar.png',
            name: '发送者',
            userId: userId.toString(),
          },
        })
      )
    })

    it('returns watch-later videos in favorite order', async () => {
      const folderId = createObjectId('507f1f77bcf86cd799439128')
      const videoId = createObjectId('507f1f77bcf86cd799439129')
      const userId = createObjectId('507f1f77bcf86cd799439183')

      vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
        createMockQuery({ _id: folderId })
      )
      vi.mocked(modelMocks.FavoriteModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: createObjectId('507f1f77bcf86cd799439130'),
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            videoId,
          },
        ])
      )
      vi.mocked(modelMocks.VideoModel.find).mockReturnValue(
        createLeanExecQuery([
          {
            _id: videoId,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            thumbnail: 'thumb.png',
            time: 100,
            title: '稍后再看',
            url: '/video',
            userId: {
              _id: createObjectId('507f1f77bcf86cd799439131'),
              name: 'UP 主',
            },
          },
        ])
      )
      vi.mocked(modelMocks.VideoStatsModel.find).mockReturnValue(
        createMockQuery([
          {
            danmakusCount: 3,
            videoId,
            viewsCount: 9,
          },
        ])
      )
      vi.mocked(modelMocks.HistoryModel.find).mockReturnValue(createMockQuery([]))

      await expect(
        VideoService.getWatchLater(
          {
            addAt: 'all',
            page: 1,
            pageSize: 20,
            sort: 'latest',
            time: 'all',
            type: 'all',
          } as never,
          userId.toString()
        )
      ).resolves.toEqual([
        {
          danmakus: 3,
          favoriteId: '507f1f77bcf86cd799439130',
          id: videoId.toString(),
          publishedAt: '2024-01-01T00:00:00.000Z',
          thumbnail: 'thumb.png',
          time: 100,
          title: '稍后再看',
          url: '/video',
          userId: '507f1f77bcf86cd799439131',
          username: 'UP 主',
          views: 9,
        },
      ])
    })

    it('returns video detail, increments stats, shares videos and deletes related rows', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439132')
      const videoId = createObjectId('507f1f77bcf86cd799439133')

      vi.spyOn((await import('mongoose')).Types.ObjectId, 'isValid').mockReturnValue(true)
      vi.mocked(modelMocks.VideoModel.findById).mockReturnValue(
        createMockQuery({
          _id: videoId,
          categoryId: createObjectId('507f1f77bcf86cd799439134'),
          description: '简介',
          publishedAt: new Date('2024-01-01T00:00:00.000Z'),
          thumbnail: 'thumb.png',
          time: 100,
          title: '视频详情',
          url: '/video',
          userId: {
            _id: userId,
            avatar: 'avatar.png',
            name: 'UP 主',
          },
        })
      )
      vi.mocked(modelMocks.VideoStatsModel.findOneAndUpdate).mockReturnValue(
        createMockQuery({
          commentsCount: 2,
          danmakusCount: 3,
          favoritesCount: 4,
          likesCount: 5,
          sharesCount: 6,
          viewsCount: 7,
        })
      )
      vi.mocked(modelMocks.HistoryModel.findOneAndUpdate).mockReturnValue(
        createMockQuery({
          duration: 10,
        })
      )
      vi.mocked(modelMocks.TagModel.find).mockReturnValue(
        createMockQuery([{ name: '动画' }, { name: 'MAD' }])
      )
      vi.mocked(modelMocks.FeedModel.findOne).mockReturnValue(
        createMockQuery({
          _id: createObjectId('507f1f77bcf86cd799439135'),
        })
      )
      vi.mocked(modelMocks.VideoModel.findOneAndDelete).mockResolvedValue({ _id: videoId })

      await expect(VideoService.getDetail(videoId.toString(), userId.toString())).resolves.toEqual(
        expect.objectContaining({
          tags: ['动画', 'MAD'],
          user: {
            avatar: 'avatar.png',
            id: userId.toString(),
            name: 'UP 主',
          },
        })
      )

      await VideoService.share('user-1', {
        content: '转发视频',
        videoId: videoId.toString(),
      })
      await VideoService.delete(videoId.toString(), 'user-1')

      expect(feedServiceMocks.FeedService.transpont).toHaveBeenCalledTimes(1)
      expect(modelMocks.VideoStatsModel.deleteOne).toHaveBeenCalledWith({
        videoId: videoId.toString(),
      })
      expect(modelMocks.FeedModel.deleteMany).toHaveBeenCalledWith({ videoId: videoId.toString() })
    })

    it('keeps liked video order and returns paged space videos', async () => {
      const videoId = createObjectId('507f1f77bcf86cd799439136')
      vi.mocked(modelMocks.LikeModel.find).mockReturnValue(createMockQuery([{ targetId: videoId }]))
      vi.mocked(modelMocks.VideoModel.aggregate)
        .mockResolvedValueOnce([{ id: videoId.toString(), title: '点赞视频' }])
        .mockResolvedValueOnce([
          {
            list: [{ id: 'video-1', title: '空间视频' }],
            total: [{ count: 1 }],
          },
        ])

      await expect(VideoService.listLike('user-1')).resolves.toEqual([
        { id: videoId.toString(), title: '点赞视频' },
      ])
      await expect(
        VideoService.listSpace({
          page: 1,
          pageSize: 20,
          sort: 'publishedAt',
          userId: createObjectId('507f1f77bcf86cd799439137').toString(),
        })
      ).resolves.toEqual({
        list: [{ id: 'video-1', title: '空间视频' }],
        total: 1,
      })
    })
  })
})
