import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MESSAGE } from '@/constants'
import { createMockQuery, createObjectId } from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  FavoriteFolderModel: {
    create: vi.fn(),
  },
  FollowModel: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
  },
  MessageModel: {
    create: vi.fn(),
  },
  UserModel: {
    countDocuments: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    updateOne: vi.fn(),
  },
}))

const feedModelMocks = vi.hoisted(() => ({
  FeedModel: {
    countDocuments: vi.fn(),
  },
}))

const utilsMocks = vi.hoisted(() => ({
  comparePassword: vi.fn(),
  hashPassword: vi.fn(),
  HttpError: class HttpError extends Error {
    statusCode: number

    constructor(statusCode: number, message: string) {
      super(message)
      this.statusCode = statusCode
    }
  },
  signToken: vi.fn(),
}))

const redisMocks = vi.hoisted(() => ({
  exists: vi.fn(),
  get: vi.fn(),
}))

const mailerMocks = vi.hoisted(() => {
  const sendMail = vi.fn()
  const createTransport = vi.fn(() => ({ sendMail }))

  return {
    createTransport,
    sendMail,
  }
})

const configMock = vi.hoisted(() => ({
  getEmailConfig: vi.fn(() => ({
    auth: {
      pass: 'smtp-pass',
      user: 'sender@example.com',
    },
    host: 'smtp.example.com',
    port: 465,
    secure: true,
  })),
}))

vi.mock('@/models', () => modelMocks)
vi.mock('@/models/feed.model', () => feedModelMocks)
vi.mock('@/utils', () => utilsMocks)
vi.mock('@/utils/redis.util', () => ({
  default: redisMocks,
}))
vi.mock('nodemailer', () => ({
  default: {
    createTransport: mailerMocks.createTransport,
  },
}))
vi.mock('@/config', () => configMock)

import { EmailService } from '@/services/email.service'
import { FollowService } from '@/services/follow.service'
import { TagService } from '@/services/tag.service'
import { UserService } from '@/services/user.service'

describe('user/follow/email/tag services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('EmailService', () => {
    it('creates a transport from config and sends verify-code mail', async () => {
      await EmailService.sendVerifyCode('target@example.com', '654321')

      expect(mailerMocks.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'sender@example.com',
          subject: 'MiliMili 邮箱验证码',
          to: 'target@example.com',
        })
      )
    })
  })

  describe('FollowService', () => {
    it('returns code 0 when a follow relation exists', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439201')
      const followingId = createObjectId('507f1f77bcf86cd799439202')
      vi.mocked(modelMocks.FollowModel.findOne).mockResolvedValue({ _id: createObjectId() })

      await expect(
        FollowService.get({ userId: userId.toString(), followingId: followingId.toString() })
      ).resolves.toEqual({
        code: 0,
      })
    })

    it('blocks following yourself', async () => {
      await expect(
        FollowService.create({ userId: 'same-id', followingId: 'same-id' })
      ).rejects.toThrow('不能关注自己')
    })

    it('creates a follow relation when it does not exist yet', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439203')
      const followingId = createObjectId('507f1f77bcf86cd799439204')
      vi.spyOn(FollowService, 'get').mockResolvedValue({ code: 1 })

      await FollowService.create({ userId: userId.toString(), followingId: followingId.toString() })

      expect(modelMocks.FollowModel.create).toHaveBeenCalledWith({
        followerId: expect.any(Object),
        followingId: expect.any(Object),
      })
    })

    it('throws when deleting a relation that does not exist', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439205')
      const followingId = createObjectId('507f1f77bcf86cd799439206')
      vi.mocked(modelMocks.FollowModel.deleteOne).mockResolvedValue({ deletedCount: 0 })

      await expect(
        FollowService.delete({ userId: userId.toString(), followingId: followingId.toString() })
      ).rejects.toThrow('未关注')
    })

    it('maps follow list entries to user cards', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439207')
      const targetId = createObjectId('507f1f77bcf86cd799439021')
      vi.mocked(modelMocks.FollowModel.countDocuments).mockResolvedValue(2)
      vi.mocked(modelMocks.FollowModel.find).mockReturnValue(
        createMockQuery([
          {
            followingId: targetId,
            followerId: createObjectId('507f1f77bcf86cd799439022'),
          },
        ])
      )
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          {
            _id: targetId,
            avatar: 'avatar.png',
            name: 'Milimili',
          },
        ])
      )

      await expect(
        FollowService.list({
          page: 1,
          pageSize: 20,
          type: 'following',
          userId: userId.toString(),
        })
      ).resolves.toEqual({
        list: [
          {
            user: {
              avatar: 'avatar.png',
              id: targetId.toString(),
              name: 'Milimili',
            },
          },
        ],
        total: 2,
      })
    })
  })

  describe('UserService', () => {
    it('returns signed tokens for password login', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439023')
      vi.mocked(modelMocks.UserModel.findOne).mockResolvedValue({
        _id: userId,
        password: 'hashed-password',
      })
      vi.mocked(utilsMocks.comparePassword).mockResolvedValue(true)
      vi.mocked(utilsMocks.signToken)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token')

      await expect(UserService.loginByPassword('user@example.com', 'password')).resolves.toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })
    })

    it('creates a new user plus default folders and welcome message on first code login', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439024')
      vi.mocked(redisMocks.exists).mockResolvedValue(true)
      vi.mocked(redisMocks.get).mockResolvedValue('123456')
      vi.mocked(modelMocks.UserModel.findOne)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
      vi.mocked(modelMocks.UserModel.findOneAndUpdate).mockResolvedValue({
        _id: userId,
        name: '新用户',
      })
      vi.mocked(utilsMocks.signToken)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token')

      await expect(UserService.loginByCode('new@example.com', '123456')).resolves.toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })
      expect(modelMocks.FavoriteFolderModel.create).toHaveBeenCalledTimes(2)
      expect(modelMocks.MessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '尊敬的新用户 欢迎来到仿照bilibili的milimili',
          type: 'system',
          userId,
        })
      )
    })

    it('returns home info with follow and feed counters', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439025')
      vi.mocked(modelMocks.UserModel.findById).mockResolvedValue({
        _id: userId,
        avatar: 'avatar.png',
        email: 'user@example.com',
        name: '测试用户',
      })
      vi.mocked(modelMocks.FollowModel.countDocuments)
        .mockResolvedValueOnce(8)
        .mockResolvedValueOnce(9)
      vi.mocked(feedModelMocks.FeedModel.countDocuments).mockResolvedValue(10)

      await expect(UserService.getInfoHome(userId.toString())).resolves.toEqual({
        feeds: 10,
        followers: 9,
        followings: 8,
        user: {
          avatar: 'avatar.png',
          email: 'user@example.com',
          id: userId.toString(),
          name: '测试用户',
        },
      })
    })

    it('updates a password after verifying the email code', async () => {
      vi.mocked(modelMocks.UserModel.findOne).mockReset()
      vi.mocked(modelMocks.UserModel.findOne).mockResolvedValue({ _id: createObjectId() })
      vi.mocked(redisMocks.exists).mockResolvedValue(true)
      vi.mocked(redisMocks.get).mockResolvedValue('888888')
      vi.mocked(utilsMocks.hashPassword).mockResolvedValue('hashed-next')

      await UserService.findPassword({
        code: '888888',
        confirmPassword: 'next-password',
        email: 'user@example.com',
        password: 'next-password',
      })

      expect(utilsMocks.hashPassword).toHaveBeenCalledWith('next-password')
      expect(modelMocks.UserModel.updateOne).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        { password: 'hashed-next' }
      )
    })

    it('returns an @mention list sorted by follow status then popularity', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439026')
      const followedId = createObjectId('507f1f77bcf86cd799439027')
      const otherId = createObjectId('507f1f77bcf86cd799439028')

      vi.mocked(modelMocks.UserModel.countDocuments).mockResolvedValue(2)
      vi.mocked(modelMocks.UserModel.find).mockReturnValue(
        createMockQuery([
          { _id: otherId, avatar: '2.png', name: '后面的人' },
          { _id: followedId, avatar: '1.png', name: '先出现的人' },
        ])
      )
      vi.mocked(modelMocks.FollowModel.aggregate).mockResolvedValue([
        { _id: followedId, count: 99 },
        { _id: otherId, count: 100 },
      ])
      vi.mocked(modelMocks.FollowModel.find).mockReturnValue(
        createMockQuery([{ followingId: followedId }])
      )

      await expect(
        UserService.getAtList(userId.toString(), {
          keyword: '人',
          page: 1,
          pageSize: 10,
        })
      ).resolves.toEqual({
        list: [
          {
            avatar: '1.png',
            followings: 99,
            id: followedId.toString(),
            isFollow: true,
            name: '先出现的人',
          },
          {
            avatar: '2.png',
            followings: 100,
            id: otherId.toString(),
            isFollow: false,
            name: '后面的人',
          },
        ],
        total: 2,
      })
    })

    it('delegates profile updates by id', async () => {
      await UserService.update('user-1', {
        avatar: 'https://example.com/new-avatar.png',
        name: '新用户名',
      })

      expect(modelMocks.UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-1',
        {
          avatar: 'https://example.com/new-avatar.png',
          name: '新用户名',
        },
        { new: true }
      )
    })

    it('returns public user info from getById', async () => {
      const userId = createObjectId('507f1f77bcf86cd799439029')
      const createdAt = new Date('2024-01-01T00:00:00.000Z')

      vi.mocked(modelMocks.UserModel.findById).mockResolvedValue({
        _id: userId,
        avatar: 'avatar.png',
        createdAt,
        email: 'user@example.com',
        name: '测试用户',
      })
      vi.mocked(modelMocks.FollowModel.countDocuments)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(4)

      await expect(UserService.getById(userId.toString())).resolves.toEqual({
        avatar: 'avatar.png',
        createdAt: createdAt.toString(),
        email: 'user@example.com',
        followers: 4,
        followings: 3,
        id: userId.toString(),
        name: '测试用户',
      })
    })

    it('throws invalid code when loginByCode cannot verify redis code', async () => {
      vi.mocked(redisMocks.exists).mockResolvedValue(false)

      await expect(UserService.loginByCode('user@example.com', '000000')).rejects.toThrow(
        MESSAGE.INVALID_CODE
      )
    })
  })

  it('keeps TagService as an empty placeholder object', () => {
    expect(TagService).toEqual({})
  })
})
