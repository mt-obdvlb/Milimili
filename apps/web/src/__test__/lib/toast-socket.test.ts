import { afterEach, describe, expect, it, vi } from 'vitest'

const loadToastModule = async () => {
  vi.resetModules()
  const message = vi.fn()
  vi.doMock('sonner', () => ({
    toast: {
      message,
    },
  }))

  const mod = await import('@/lib/toast')
  return {
    message,
    ...mod,
  }
}

const loadSocketModule = async (env: Record<string, string | undefined>) => {
  vi.resetModules()
  const io = vi.fn(() => ({
    close: vi.fn(),
  }))
  vi.doMock('socket.io-client', () => ({
    io,
  }))

  process.env.NODE_ENV = env.NODE_ENV
  if (env.NEXT_PUBLIC_WS_URL === undefined) {
    delete process.env.NEXT_PUBLIC_WS_URL
  } else {
    process.env.NEXT_PUBLIC_WS_URL = env.NEXT_PUBLIC_WS_URL
  }

  const mod = await import('@/lib/socket')
  return { io, ...mod }
}

describe('toast and socket libs', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('throttles toast messages and exposes the building toast helper', async () => {
    vi.useFakeTimers()
    const { message, toast, toastBuilding } = await loadToastModule()

    toast('hello')
    toast('hello again')
    toastBuilding()

    expect(message).toHaveBeenCalledTimes(2)
    expect(message).toHaveBeenNthCalledWith(1, 'hello')
    expect(message).toHaveBeenNthCalledWith(2, '正在建设中...')

    vi.advanceTimersByTime(1000)
    toast('after wait')
    expect(message).toHaveBeenNthCalledWith(3, 'after wait')
  })

  it('creates a singleton socket client with environment-aware urls', async () => {
    const development = await loadSocketModule({
      NODE_ENV: 'development',
      NEXT_PUBLIC_WS_URL: undefined,
    })

    const first = development.getSocket()
    const second = development.getSocket()

    expect(first).toBe(second)
    expect(development.io).toHaveBeenCalledTimes(1)
    expect(development.io).toHaveBeenCalledWith('http://localhost:3000', {
      autoConnect: false,
      path: '/socket.io/',
      transports: undefined,
      withCredentials: true,
    })

    const production = await loadSocketModule({
      NODE_ENV: 'production',
      NEXT_PUBLIC_WS_URL: '/socket.io/',
    })
    production.getSocket()
    expect(production.io).toHaveBeenCalledWith(undefined, {
      autoConnect: false,
      path: '/socket.io/',
      transports: ['websocket'],
      withCredentials: true,
    })
  })
})
