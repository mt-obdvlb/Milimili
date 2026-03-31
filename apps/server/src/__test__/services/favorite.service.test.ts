import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MESSAGE } from '@/constants'
import { createMockQuery, createObjectId } from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  FavoriteFolderModel: {
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
  },
  FavoriteModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    insertMany: vi.fn(),
    updateMany: vi.fn(),
  },
  HistoryModel: {
    find: vi.fn(),
  },
  VideoModel: {
    find: vi.fn(),
  },
  VideoStatsModel: {
    updateMany: vi.fn(),
    updateOne: vi.fn(),
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
vi.mock('@/utils', () => utilsMocks)

import { FavoriteService } from '@/services/favorite.service'

describe('FavoriteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists folders with per-folder item counts', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439061')
    vi.mocked(modelMocks.FavoriteFolderModel.find).mockReturnValue(
      createMockQuery([
        {
          _id: folderId,
          description: 'desc',
          name: '默认收藏夹',
          thumbnail: 'thumb.png',
          type: 'default',
        },
      ])
    )
    vi.mocked(modelMocks.FavoriteModel.countDocuments).mockResolvedValue(3)

    await expect(FavoriteService.listFolder('user-1')).resolves.toEqual([
      {
        description: 'desc',
        id: folderId.toString(),
        name: '默认收藏夹',
        number: 3,
        thumbnail: 'thumb.png',
        type: 'default',
      },
    ])
  })

  it('maps aggregate results in list()', async () => {
    const favoriteId = createObjectId('507f1f77bcf86cd799439062')
    const videoId = createObjectId('507f1f77bcf86cd799439063')
    const userId = createObjectId('507f1f77bcf86cd799439064')
    const folderId = createObjectId('507f1f77bcf86cd799439082')

    vi.mocked(modelMocks.FavoriteModel.aggregate).mockResolvedValue([
      {
        list: [
          {
            favoriteAt: new Date('2024-01-01T00:00:00.000Z'),
            id: favoriteId,
            user: {
              avatar: 'avatar.png',
              id: userId,
              name: '作者',
            },
            video: {
              id: videoId,
              publishedAt: new Date('2024-01-02T00:00:00.000Z'),
              thumbnail: 'thumb.png',
              time: 100,
              title: '视频',
              url: '/video',
              views: 9,
            },
          },
        ],
        total: 1,
      },
    ])

    await expect(
      FavoriteService.list({
        favoriteFolderId: folderId.toString(),
        page: 1,
        pageSize: 20,
        sort: 'favoriteAt',
      })
    ).resolves.toEqual({
      list: [
        {
          favoriteAt: new Date('2024-01-01T00:00:00.000Z'),
          id: favoriteId.toString(),
          user: {
            avatar: 'avatar.png',
            id: userId.toString(),
            name: '作者',
          },
          video: {
            id: videoId.toString(),
            publishedAt: new Date('2024-01-02T00:00:00.000Z'),
            thumbnail: 'thumb.png',
            time: 100,
            title: '视频',
            url: '/video',
            views: 9,
          },
        },
      ],
      total: 1,
    })
  })

  it('builds recent folder summaries from list()', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439065')
    vi.mocked(modelMocks.FavoriteFolderModel.find).mockReturnValue(
      createMockQuery([
        {
          _id: folderId,
          name: '稍后再看',
        },
      ])
    )
    vi.spyOn(FavoriteService, 'list').mockResolvedValue({
      list: [{ id: 'favorite-1' }] as never,
      total: 1,
    })

    await expect(FavoriteService.listRecent('user-1')).resolves.toEqual([
      {
        folderId: folderId.toString(),
        folderName: '稍后再看',
        list: [{ id: 'favorite-1' }],
      },
    ])
  })

  it('deletes favorite batches and decrements video stats when rows were removed', async () => {
    const userId = createObjectId('507f1f77bcf86cd799439083')
    vi.mocked(modelMocks.FavoriteModel.deleteMany).mockResolvedValue({ deletedCount: 2 })

    await FavoriteService.deleteBatch(
      {
        ids: ['507f1f77bcf86cd799439084', '507f1f77bcf86cd799439085'],
      },
      userId.toString()
    )

    expect(modelMocks.VideoStatsModel.updateMany).toHaveBeenCalled()
  })

  it('cleans watch later only for finished videos', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439066')
    const finishedVideoId = createObjectId('507f1f77bcf86cd799439067')
    const userId = createObjectId('507f1f77bcf86cd799439086')

    vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
      createMockQuery({ _id: folderId })
    )
    vi.mocked(modelMocks.FavoriteModel.find).mockReturnValue(
      createMockQuery([
        {
          _id: createObjectId('507f1f77bcf86cd799439068'),
          videoId: finishedVideoId,
        },
      ])
    )
    vi.mocked(modelMocks.HistoryModel.find).mockReturnValue(
      createMockQuery([
        {
          duration: 98,
          videoId: finishedVideoId,
        },
      ])
    )
    vi.mocked(modelMocks.VideoModel.find).mockReturnValue(
      createMockQuery([
        {
          _id: finishedVideoId,
          time: 100,
        },
      ])
    )

    await FavoriteService.cleanWatchLater(userId.toString())

    expect(modelMocks.FavoriteModel.deleteMany).toHaveBeenCalledWith({
      folderId,
      videoId: { $in: [finishedVideoId] },
    })
    expect(modelMocks.VideoStatsModel.updateMany).toHaveBeenCalledWith(
      { videoId: { $in: [finishedVideoId] } },
      { $inc: { favoritesCount: -1 } }
    )
  })

  it('adds missing favorites in batch and ignores existing ones', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439069')
    const existingVideoId = createObjectId('507f1f77bcf86cd799439070')
    const userId = createObjectId('507f1f77bcf86cd799439087')

    vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
      createMockQuery({ _id: folderId })
    )
    vi.mocked(modelMocks.FavoriteModel.find).mockReturnValue(
      createMockQuery([
        {
          videoId: existingVideoId,
        },
      ])
    )

    await FavoriteService.addBatch(
      {
        folderId: folderId.toString(),
        videoIds: [existingVideoId.toString(), '507f1f77bcf86cd799439071'],
      },
      userId.toString()
    )

    expect(modelMocks.FavoriteModel.insertMany).toHaveBeenCalledTimes(1)
    expect(modelMocks.VideoStatsModel.updateMany).toHaveBeenCalledTimes(1)
  })

  it('moves favorites to another folder only when the target folder exists', async () => {
    const targetFolderId = createObjectId('507f1f77bcf86cd799439072')
    const favoriteId = createObjectId('507f1f77bcf86cd799439073')
    const userId = createObjectId('507f1f77bcf86cd799439088')

    vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
      createMockQuery({ _id: targetFolderId })
    )
    vi.mocked(modelMocks.FavoriteModel.find).mockReturnValue(createMockQuery([{ _id: favoriteId }]))

    await FavoriteService.moveBatch(
      {
        ids: [favoriteId.toString()],
        targetFolderId: targetFolderId.toString(),
      },
      userId.toString()
    )

    expect(modelMocks.FavoriteModel.updateMany).toHaveBeenCalledWith(
      { _id: { $in: [favoriteId] } },
      { $set: { folderId: targetFolderId } }
    )
  })

  it('creates a new normal folder and rejects duplicated names', async () => {
    const userId = createObjectId('507f1f77bcf86cd799439089')
    vi.mocked(modelMocks.FavoriteFolderModel.findOne)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        _id: createObjectId('507f1f77bcf86cd799439074'),
      })

    await FavoriteService.folderAdd(
      {
        description: 'desc',
        name: '新收藏夹',
        thumbnail: 'thumb.png',
      },
      userId.toString()
    )

    await expect(
      FavoriteService.folderAdd(
        {
          name: '新收藏夹',
        },
        userId.toString()
      )
    ).rejects.toThrow(MESSAGE.FOLDER_EXIST)
  })

  it('returns 0 when a video is favorited and 1 otherwise', async () => {
    const userId = createObjectId('507f1f77bcf86cd799439090')
    vi.mocked(modelMocks.FavoriteModel.findOne)
      .mockResolvedValueOnce({ _id: createObjectId('507f1f77bcf86cd799439075') })
      .mockResolvedValueOnce(null)
    vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
      createMockQuery({ _id: createObjectId() })
    )

    await expect(FavoriteService.get('video-1', userId.toString())).resolves.toBe(0)
    await expect(FavoriteService.isWatchLater(userId.toString(), 'video-1')).resolves.toBe(1)
  })

  it('returns folder detail with favorite count', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439076')
    vi.mocked(modelMocks.FavoriteFolderModel.findById).mockReturnValue(
      createMockQuery({
        _id: folderId,
        description: 'desc',
        name: '收藏夹',
        thumbnail: 'thumb.png',
        type: 'normal',
      })
    )
    vi.mocked(modelMocks.FavoriteModel.countDocuments).mockResolvedValue(5)

    await expect(FavoriteService.detailByFolderId(folderId.toString())).resolves.toEqual({
      description: 'desc',
      id: folderId.toString(),
      name: '收藏夹',
      number: 5,
      thumbnail: 'thumb.png',
      type: 'normal',
    })
  })

  it('deletes a normal folder and associated favorite stats', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439077')
    const videoId = createObjectId('507f1f77bcf86cd799439078')
    const userId = createObjectId('507f1f77bcf86cd799439091')

    vi.mocked(modelMocks.FavoriteFolderModel.findOne).mockReturnValue(
      createMockQuery({
        _id: folderId,
        type: 'normal',
      })
    )
    vi.mocked(modelMocks.FavoriteModel.find).mockReturnValue(createMockQuery([{ videoId }]))

    await FavoriteService.folderDelete(userId.toString(), folderId.toString())

    expect(modelMocks.FavoriteModel.deleteMany).toHaveBeenCalledWith({ folderId })
    expect(modelMocks.VideoStatsModel.updateMany).toHaveBeenCalledWith(
      { videoId: { $in: [videoId] } },
      { $inc: { favoritesCount: -1 } }
    )
    expect(modelMocks.FavoriteFolderModel.deleteOne).toHaveBeenCalledWith({ _id: folderId })
  })

  it('updates only allowed folder fields and skips empty updates', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439079')
    const userId = createObjectId('507f1f77bcf86cd799439092')
    vi.mocked(modelMocks.FavoriteFolderModel.findOne)
      .mockReturnValueOnce(
        createMockQuery({
          _id: folderId,
          type: 'normal',
        })
      )
      .mockReturnValueOnce(
        createMockQuery({
          _id: folderId,
          type: 'default',
        })
      )

    await FavoriteService.folderUpdate(userId.toString(), folderId.toString(), {
      description: 'new-desc',
      name: '  新名字  ',
      thumbnail: 'next.png',
    })
    await FavoriteService.folderUpdate(userId.toString(), folderId.toString(), {
      name: '不会更新',
    })

    expect(modelMocks.FavoriteFolderModel.updateOne).toHaveBeenNthCalledWith(
      1,
      { _id: folderId },
      {
        $set: {
          description: 'new-desc',
          name: '新名字',
          thumbnail: 'next.png',
        },
      }
    )
    expect(modelMocks.FavoriteFolderModel.updateOne).toHaveBeenCalledTimes(1)
  })

  it('toggles watch-later favorites and exposes watch-later status', async () => {
    const folderId = createObjectId('507f1f77bcf86cd799439080')
    const favoriteId = createObjectId('507f1f77bcf86cd799439081')
    const userId = createObjectId('507f1f77bcf86cd799439093')
    const videoId = createObjectId('507f1f77bcf86cd799439094')

    vi.mocked(modelMocks.FavoriteFolderModel.findOne)
      .mockReturnValueOnce(createMockQuery({ _id: folderId }))
      .mockReturnValueOnce(createMockQuery({ _id: folderId }))
      .mockReturnValueOnce(createMockQuery({ _id: folderId }))
    vi.mocked(modelMocks.FavoriteModel.findOne)
      .mockResolvedValueOnce({ _id: favoriteId })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: favoriteId })

    await FavoriteService.watchLaterAddOrDelete(userId.toString(), videoId.toString())
    await FavoriteService.watchLaterAddOrDelete(userId.toString(), videoId.toString())
    await expect(FavoriteService.isWatchLater(userId.toString(), videoId.toString())).resolves.toBe(
      0
    )

    expect(modelMocks.FavoriteModel.deleteOne).toHaveBeenCalledWith({ _id: favoriteId })
    expect(modelMocks.FavoriteModel.create).toHaveBeenCalledTimes(1)
    expect(modelMocks.VideoStatsModel.updateOne).toHaveBeenCalledTimes(2)
  })
})
