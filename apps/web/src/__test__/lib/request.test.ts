import { AxiosHeaders } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

type MockAxiosError = {
  config: Record<string, unknown>
  response?: {
    status?: number
    data?: unknown
  }
}

const createAxiosHarness = () => {
  let requestHandler:
    | ((
        config: Record<string, unknown>
      ) => Promise<Record<string, unknown>> | Record<string, unknown>)
    | undefined
  let responseError: ((error: MockAxiosError) => Promise<unknown> | unknown) | undefined

  const instance = vi.fn((config: Record<string, unknown>) =>
    Promise.resolve({
      retried: true,
      config,
    })
  ) as unknown as ReturnType<typeof vi.fn> & {
    post: ReturnType<typeof vi.fn>
    interceptors: {
      request: { use: ReturnType<typeof vi.fn> }
      response: { use: ReturnType<typeof vi.fn> }
    }
  }

  instance.post = vi.fn()
  instance.interceptors = {
    request: {
      use: vi.fn((handler) => {
        requestHandler = handler
      }),
    },
    response: {
      use: vi.fn((_success, errorHandler) => {
        responseError = errorHandler
      }),
    },
  }

  return {
    createMock: vi.fn(() => instance),
    instance,
    getRequestHandler: () => requestHandler,
    getResponseError: () => responseError,
  }
}

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const loadRequestModule = async (options: {
  isServer: boolean
  cookieValues?: Record<string, string>
  toastSpy?: ReturnType<typeof vi.fn>
}) => {
  vi.resetModules()

  const harness = createAxiosHarness()
  const toastSpy = options.toastSpy ?? vi.fn()

  vi.doMock('axios', async () => {
    const actual = await vi.importActual<typeof import('axios')>('axios')
    return {
      ...actual,
      default: {
        ...actual.default,
        create: harness.createMock,
      },
      create: harness.createMock,
    }
  })

  vi.doMock('@/utils', () => ({
    isServer: () => options.isServer,
  }))

  vi.doMock('@/lib/toast', () => ({
    toast: toastSpy,
  }))

  if (options.isServer) {
    vi.doMock('next/headers', () => ({
      cookies: async () => ({
        get: (name: string) => {
          const value = options.cookieValues?.[name]
          return value ? { value } : undefined
        },
      }),
    }))
  } else {
    vi.doUnmock('next/headers')
  }

  await import('@/lib/request')

  return {
    harness,
    toastSpy,
  }
}

describe('request', () => {
  afterEach(() => {
    vi.doUnmock('axios')
    vi.doUnmock('@/utils')
    vi.doUnmock('@/lib/toast')
    vi.doUnmock('next/headers')
    vi.resetModules()
  })

  it('injects SSR cookies into the request headers', async () => {
    const { harness } = await loadRequestModule({
      isServer: true,
      cookieValues: {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      },
    })

    const requestHandler = harness.getRequestHandler()

    expect(requestHandler).toBeTypeOf('function')

    const config = await requestHandler?.({
      headers: {},
    })

    expect(new AxiosHeaders((config?.headers ?? {}) as Record<string, string>).get('Cookie')).toBe(
      'access_token=access-token; refresh_token=refresh-token'
    )
  })

  it('shares one refresh request across concurrent 401 responses', async () => {
    const { harness } = await loadRequestModule({
      isServer: false,
    })
    const refreshDeferred = createDeferred<{
      data: {
        accessToken: string
        refreshToken: string
      }
    }>()
    const responseError = harness.getResponseError()
    const firstRequest = {
      headers: new AxiosHeaders(),
      _retry: false,
      url: '/videos',
    }
    const secondRequest = {
      headers: new AxiosHeaders(),
      _retry: false,
      url: '/feeds',
    }

    harness.instance.post.mockReturnValue(refreshDeferred.promise)

    const firstPromise = responseError?.({
      config: firstRequest,
      response: {
        status: 401,
        data: {
          message: '登录信息已过期，请重新登录',
        },
      },
    })
    const secondPromise = responseError?.({
      config: secondRequest,
      response: {
        status: 401,
        data: {
          message: '登录信息已过期，请重新登录',
        },
      },
    })

    expect(harness.instance.post).toHaveBeenCalledTimes(1)

    refreshDeferred.resolve({
      data: {
        accessToken: 'fresh-access',
        refreshToken: 'fresh-refresh',
      },
    })

    const [firstResult, secondResult] = await Promise.all([firstPromise, secondPromise])

    expect(firstRequest._retry).toBe(true)
    expect(secondRequest._retry).toBe(true)
    expect(harness.instance).toHaveBeenCalledTimes(2)
    expect(firstResult).toEqual({
      retried: true,
      config: firstRequest,
    })
    expect(secondResult).toEqual({
      retried: true,
      config: secondRequest,
    })
  })

  it('returns the original 401 payload and toasts on refresh failure', async () => {
    const toastSpy = vi.fn()
    const { harness } = await loadRequestModule({
      isServer: false,
      toastSpy,
    })
    const responseError = harness.getResponseError()
    const originalRequest = {
      headers: new AxiosHeaders(),
      _retry: false,
      url: '/videos',
    }

    harness.instance.post.mockRejectedValue(new Error('refresh failed'))

    const result = await responseError?.({
      config: originalRequest,
      response: {
        status: 401,
        data: {
          message: '登录信息已过期，请重新登录',
        },
      },
    })

    expect(originalRequest._retry).toBe(true)
    expect(harness.instance).not.toHaveBeenCalled()
    expect(toastSpy).toHaveBeenCalledWith('登录信息已过期，请重新登录')
    expect(result).toEqual({
      message: '登录信息已过期，请重新登录',
    })
  })
})
