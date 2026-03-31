import { Types } from 'mongoose'
import { vi } from 'vitest'

type MockQueryResult<T> = {
  catch: ReturnType<typeof vi.fn>
  exec: ReturnType<typeof vi.fn>
  finally: ReturnType<typeof vi.fn>
  lean: ReturnType<typeof vi.fn>
  limit: ReturnType<typeof vi.fn>
  populate: ReturnType<typeof vi.fn>
  select: ReturnType<typeof vi.fn>
  skip: ReturnType<typeof vi.fn>
  sort: ReturnType<typeof vi.fn>
  then: ReturnType<typeof vi.fn>
}

export const createObjectId = (value = '507f1f77bcf86cd799439011') => new Types.ObjectId(value)

export const createMockQuery = <T>(result: T): MockQueryResult<T> => {
  const query = {
    catch: vi.fn((onRejected?: (reason: unknown) => unknown) =>
      Promise.resolve(result).catch(onRejected)
    ),
    exec: vi.fn().mockResolvedValue(result),
    finally: vi.fn((onFinally?: () => void) => Promise.resolve(result).finally(onFinally)),
    lean: vi.fn().mockResolvedValue(result),
    limit: vi.fn(),
    populate: vi.fn(),
    select: vi.fn(),
    skip: vi.fn(),
    sort: vi.fn(),
    then: vi.fn((onFulfilled?: (value: T) => unknown, onRejected?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(onFulfilled, onRejected)
    ),
  } satisfies MockQueryResult<T>

  query.limit.mockReturnValue(query)
  query.populate.mockReturnValue(query)
  query.select.mockReturnValue(query)
  query.skip.mockReturnValue(query)
  query.sort.mockReturnValue(query)

  return query
}

export const createExecOnlyQuery = <T>(result: T) => ({
  exec: vi.fn().mockResolvedValue(result),
})

export const createLeanExecQuery = <T>(result: T) => {
  const query = createMockQuery(result)
  query.lean.mockReturnValue(query)
  return query
}

export const toHex = (value: Types.ObjectId | string) =>
  value instanceof Types.ObjectId ? value.toString() : value
