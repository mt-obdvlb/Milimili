import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MESSAGE } from '@/constants'
import { createObjectId } from '@/__test__/utils/service-test.utils'

const modelMocks = vi.hoisted(() => ({
  CategoryModel: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
  },
  SearchLogModel: {
    aggregate: vi.fn(),
    create: vi.fn(),
  },
  UserModel: {
    findById: vi.fn(),
  },
}))

const utilsMocks = vi.hoisted(() => ({
  signToken: vi.fn(),
  verifyToken: vi.fn(),
}))

const redisMocks = vi.hoisted(() => ({
  exists: vi.fn(),
  set: vi.fn(),
}))

const generateCodeMock = vi.hoisted(() => vi.fn())
const emailServiceMocks = vi.hoisted(() => ({
  EmailService: {
    sendVerifyCode: vi.fn(),
  },
}))

vi.mock('@/models', () => modelMocks)
vi.mock('@/utils', () => utilsMocks)
vi.mock('@/utils/redis.util', () => ({
  default: redisMocks,
}))
vi.mock('@/utils/generate-code.util', () => ({
  generateCode: generateCodeMock,
}))
vi.mock('@/services/email.service', () => emailServiceMocks)

import { AuthService } from '@/services/auth.service'
import { CategoryService } from '@/services/category.service'
import { SearchLogService } from '@/services/search-log.service'
import { EmailService } from '@/services/email.service'

describe('auth/category/search-log services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AuthService.refreshToken', () => {
    it('throws when refresh token cannot be decoded', async () => {
      vi.mocked(utilsMocks.verifyToken).mockReturnValue(null)

      await expect(AuthService.refreshToken('bad-refresh')).rejects.toThrow(MESSAGE.INVALID_TOKEN)
      expect(modelMocks.UserModel.findById).not.toHaveBeenCalled()
    })

    it('throws when the decoded user does not exist', async () => {
      vi.mocked(utilsMocks.verifyToken).mockReturnValue({ id: 'user-1' })
      vi.mocked(modelMocks.UserModel.findById).mockResolvedValue(null)

      await expect(AuthService.refreshToken('refresh-1')).rejects.toThrow(MESSAGE.USER_NOT_FOUND)
    })

    it('returns rotated access and refresh tokens for an existing user', async () => {
      const userId = createObjectId()

      vi.mocked(utilsMocks.verifyToken).mockReturnValue({ id: userId.toString() })
      vi.mocked(modelMocks.UserModel.findById).mockResolvedValue({
        id: userId.toString(),
      })
      vi.mocked(utilsMocks.signToken)
        .mockReturnValueOnce('next-access')
        .mockReturnValueOnce('next-refresh')

      await expect(AuthService.refreshToken('refresh-2')).resolves.toEqual({
        accessToken: 'next-access',
        newRefreshToken: 'next-refresh',
      })
      expect(utilsMocks.signToken).toHaveBeenNthCalledWith(1, { id: userId.toString() }, 'access')
      expect(utilsMocks.signToken).toHaveBeenNthCalledWith(2, { id: userId.toString() }, 'refresh')
    })
  })

  describe('AuthService.sendCode', () => {
    it('throws when the email is still rate-limited', async () => {
      vi.mocked(redisMocks.exists).mockResolvedValue(true)

      await expect(AuthService.sendCode('user@example.com')).rejects.toThrow(
        MESSAGE.RATE_LIMIT_EXCEEDED
      )
      expect(generateCodeMock).not.toHaveBeenCalled()
    })

    it('stores the code in redis and sends the email when the limiter is open', async () => {
      vi.mocked(redisMocks.exists).mockResolvedValue(false)
      vi.mocked(generateCodeMock).mockReturnValue('123456')

      await AuthService.sendCode('user@example.com')

      expect(generateCodeMock).toHaveBeenCalledWith(6)
      expect(redisMocks.set).toHaveBeenNthCalledWith(
        1,
        'email_code:user@example.com',
        '123456',
        'EX',
        300
      )
      expect(redisMocks.set).toHaveBeenNthCalledWith(
        2,
        'email_code_timer:user@example.com',
        '1',
        'EX',
        60
      )
      expect(EmailService.sendVerifyCode).toHaveBeenCalledWith('user@example.com', '123456')
    })
  })

  describe('CategoryService', () => {
    it('creates a category by name', async () => {
      await CategoryService.create('番剧')

      expect(modelMocks.CategoryModel.create).toHaveBeenCalledWith({ name: '番剧' })
    })

    it('maps the full category list to transport shape', async () => {
      const categoryId = createObjectId('507f1f77bcf86cd799439012')
      vi.mocked(modelMocks.CategoryModel.find).mockResolvedValue([
        { _id: categoryId, name: '游戏' },
      ])

      await expect(CategoryService.getAll()).resolves.toEqual([
        { id: categoryId.toString(), name: '游戏' },
      ])
    })

    it('returns empty fallback fields when a category is missing by id', async () => {
      vi.mocked(modelMocks.CategoryModel.findById).mockResolvedValue(null)

      await expect(CategoryService.getById('missing-id')).resolves.toEqual({
        id: '',
        name: '',
      })
    })

    it('maps a found category by name from lean results', async () => {
      const categoryId = createObjectId('507f1f77bcf86cd799439013')
      vi.mocked(modelMocks.CategoryModel.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: categoryId,
          name: '生活',
        }),
      })

      await expect(CategoryService.getByName('生活')).resolves.toEqual({
        id: categoryId.toString(),
        name: '生活',
      })
    })
  })

  describe('SearchLogService', () => {
    it('ignores empty keywords when adding logs', async () => {
      await SearchLogService.add({ keyword: '   ' })

      expect(modelMocks.SearchLogModel.create).not.toHaveBeenCalled()
    })

    it('trims keywords before persisting logs', async () => {
      await SearchLogService.add({ keyword: '  milimili  ' })

      expect(modelMocks.SearchLogModel.create).toHaveBeenCalledWith({
        keyword: 'milimili',
      })
    })

    it('returns ranked top10 keywords from aggregate results', async () => {
      vi.mocked(modelMocks.SearchLogModel.aggregate).mockReturnValue({
        exec: vi.fn().mockResolvedValue([{ _id: '动画' }, { _id: '鬼畜' }]),
      })

      await expect(SearchLogService.getTop10()).resolves.toEqual([
        { keyword: '动画', rank: 1 },
        { keyword: '鬼畜', rank: 2 },
      ])
    })

    it('returns random keyword suggestions as-is from aggregate output', async () => {
      vi.mocked(modelMocks.SearchLogModel.aggregate).mockReturnValue({
        exec: vi.fn().mockResolvedValue([{ keyword: '推荐词' }]),
      })

      await expect(SearchLogService.get()).resolves.toEqual([{ keyword: '推荐词' }])
    })
  })
})
