import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeUserStore } from '@/stores/user'

const socketMocks = vi.hoisted(() => {
  const socket = {
    connect: vi.fn(),
    connected: false,
    disconnect: vi.fn(),
    id: 'socket-1',
    off: vi.fn(),
    on: vi.fn(),
  }

  return {
    getSocket: vi.fn(() => socket),
    socket,
  }
})

const reactQueryMocks = vi.hoisted(() => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}))

vi.mock('@/lib/socket', () => socketMocks)
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<object>('@tanstack/react-query')
  return {
    ...actual,
    useQueryClient: () => reactQueryMocks.queryClient,
  }
})

import { SocketInitializer } from '@/components/initializer/SocketInitializer'
import { StoreInitializer } from '@/components/initializer/StoreInitializer'

describe('runtime initializers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    initializeUserStore({ user: null })
    socketMocks.socket.connected = false
    socketMocks.socket.on.mockReset()
    socketMocks.socket.off.mockReset()
    socketMocks.socket.connect.mockReset()
    reactQueryMocks.queryClient.invalidateQueries.mockReset()
  })

  it('hydrates the user store through StoreInitializer', async () => {
    render(
      <StoreInitializer initialUser={{ user: { id: 'user-2', name: '初始化用户' } as never }} />
    )

    await waitFor(() => {
      expect(initializeUserStore().getState().user).toEqual({
        id: 'user-2',
        name: '初始化用户',
      })
    })
  })

  it('connects sockets for logged-in users and invalidates key queries on socket events', async () => {
    const handlers = new Map<string, () => Promise<void> | void>()
    socketMocks.socket.on.mockImplementation(
      (event: string, handler: () => Promise<void> | void) => {
        handlers.set(event, handler)
        return socketMocks.socket
      }
    )

    initializeUserStore({
      user: { id: 'user-3', name: '在线用户' } as never,
    })

    render(<SocketInitializer />)

    await waitFor(() => {
      expect(socketMocks.socket.connect).toHaveBeenCalledTimes(1)
    })

    await handlers.get('new_notification')?.()
    await handlers.get('new_history')?.()
    await handlers.get('new_favorite')?.()
    await handlers.get('new_feed')?.()
    await handlers.get('new_whisper')?.()

    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['message', 'statistics'],
    })
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['history', 'recent'],
    })
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['favorite', 'recent'],
    })
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['feed', 'recent'],
    })
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['conversation'],
    })
  })
})
