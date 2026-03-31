import { afterEach, expect, vi } from 'vitest'

export const mockRequest = {
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}

export const resetRequestMocks = () => {
  mockRequest.get.mockReset()
  mockRequest.post.mockReset()
  mockRequest.put.mockReset()
  mockRequest.delete.mockReset()
}

export const expectRequestCalled = (
  method: keyof typeof mockRequest,
  ...args: Parameters<(typeof mockRequest)[typeof method]>
) => {
  expect(mockRequest[method]).toHaveBeenCalledTimes(1)
  expect(mockRequest[method]).toHaveBeenCalledWith(...args)
}

afterEach(() => {
  resetRequestMocks()
})
