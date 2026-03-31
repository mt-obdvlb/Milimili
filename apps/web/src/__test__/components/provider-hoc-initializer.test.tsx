import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUiStore } from '@/stores'
import { initializeUserStore } from '@/stores/user'
import { getMockProps } from '@/__test__/utils/component.mock'

const queryProviderMocks = vi.hoisted(() => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='QueryClientProvider'>{children}</div>
  ),
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}))

const queryClientHookMocks = vi.hoisted(() => ({
  useQueryClientInstance: vi.fn(),
}))

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

const nextThemesMocks = vi.hoisted(() => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-props={JSON.stringify(props)} data-testid='NextThemesProvider'>
      {children}
    </div>
  ),
}))

const initializerMocks = vi.hoisted(() => ({
  getUser: vi.fn(),
}))

const userFeatureMocks = vi.hoisted(() => ({
  useUserGetByName: vi.fn(),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<object>('@tanstack/react-query')
  return {
    ...actual,
    QueryClientProvider: queryProviderMocks.QueryClientProvider,
    useQueryClient: () => queryProviderMocks.queryClient,
  }
})
vi.mock('@/hooks/useQueryClient', () => queryClientHookMocks)
vi.mock('@/lib/socket', () => socketMocks)
vi.mock('next-themes', () => nextThemesMocks)
vi.mock('@/components/initializer/StoreInitializer', () => ({
  StoreInitializer: ({ initialUser }: { initialUser?: unknown }) => (
    <div data-props={JSON.stringify({ initialUser })} data-testid='StoreInitializer' />
  ),
}))
vi.mock('@/components/initializer/DanmakuInitializer', () => ({
  DanmakuInitializer: () => <div data-testid='DanmakuInitializer' />,
}))
vi.mock('@/components/initializer/SocketInitializer', () => ({
  SocketInitializer: () => <div data-testid='SocketInitializer' />,
}))
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid='Toaster' />,
}))
vi.mock('@/services/user', () => ({
  getUser: initializerMocks.getUser,
}))
vi.mock('@/features', () => userFeatureMocks)

import QueryProvider from '@/components/provider/QueryProvider'
import Provider from '@/components/provider/Provider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { SocketProvider, useSocketContext } from '@/components/provider/SocketProvider'
import Initializer from '@/components/initializer/Initializer'
import WithAuth from '@/components/hoc/WithAuth'
import WithAt from '@/components/hoc/WithAt'
import { MessageProvider, useMessageContext } from '@/features/message/useMessageContext'

describe('provider, hoc, and initializer components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useUiStore.setState({
      loginModel: false,
      setLoginModel: (value) => useUiStore.setState({ loginModel: value }),
    })
    initializeUserStore({ user: null })
    vi.mocked(queryClientHookMocks.useQueryClientInstance).mockReturnValue([
      { id: 'query-client' },
    ] as never)
    queryProviderMocks.queryClient.invalidateQueries.mockReset()
    socketMocks.socket.connect.mockReset()
    socketMocks.socket.disconnect.mockReset()
    socketMocks.socket.off.mockReset()
    socketMocks.socket.on.mockReset()
    socketMocks.socket.connected = false
  })

  it('wraps children with QueryClientProvider and composes the root Provider tree', () => {
    render(
      <QueryProvider>
        <div data-testid='query-child'>child</div>
      </QueryProvider>
    )

    expect(screen.getByTestId('QueryClientProvider')).toBeInTheDocument()
    expect(screen.getByTestId('query-child')).toBeInTheDocument()
    expect(queryClientHookMocks.useQueryClientInstance).toHaveBeenCalled()

    render(
      <Provider>
        <div data-testid='provider-child'>provider child</div>
      </Provider>
    )

    expect(screen.getByTestId('provider-child')).toBeInTheDocument()
  })

  it('passes light-theme defaults through ThemeProvider', () => {
    render(
      <ThemeProvider>
        <div>theme child</div>
      </ThemeProvider>
    )

    expect(getMockProps(screen.getByTestId('NextThemesProvider'))).toEqual({
      attribute: 'class',
      defaultTheme: 'light',
      disableTransitionOnChange: true,
      enableSystem: true,
    })
  })

  it('provides the socket instance and disconnects on unmount', () => {
    const Consumer = () => {
      const { socket } = useSocketContext()
      return <div data-testid='socket-id'>{socket?.id ?? 'none'}</div>
    }

    const view = render(
      <SocketProvider>
        <Consumer />
      </SocketProvider>
    )

    expect(screen.getByTestId('socket-id')).toHaveTextContent('socket-1')

    view.unmount()
    expect(socketMocks.socket.disconnect).toHaveBeenCalledTimes(1)
  })

  it('renders initializer children with fetched user payload', async () => {
    vi.mocked(initializerMocks.getUser).mockResolvedValue({
      data: { id: 'user-1', name: 'Milimili' },
    } as never)

    render(await Initializer())

    expect(screen.getByTestId('DanmakuInitializer')).toBeInTheDocument()
    expect(screen.getByTestId('SocketInitializer')).toBeInTheDocument()
    expect(screen.getByTestId('Toaster')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('StoreInitializer'))).toEqual({
      initialUser: {
        user: { id: 'user-1', name: 'Milimili' },
      },
    })
  })

  it('opens the login modal when unauthenticated WithAuth children are clicked', async () => {
    render(
      <WithAuth>
        <button type='button'>需要登录</button>
      </WithAuth>
    )

    fireEvent.click(screen.getByRole('button', { name: '需要登录' }))

    await waitFor(() => {
      expect(useUiStore.getState().loginModel).toBe(true)
    })
  })

  it('lets authenticated or none-mode WithAuth children pass through untouched', () => {
    initializeUserStore({
      user: { id: 'user-1', name: 'Milimili' } as never,
    })

    const onClick = vi.fn()
    render(
      <>
        <WithAuth>
          <button onClick={onClick} type='button'>
            已登录
          </button>
        </WithAuth>
        <WithAuth none>
          <button onClick={onClick} type='button'>
            免登录
          </button>
        </WithAuth>
      </>
    )

    fireEvent.click(screen.getByRole('button', { name: '已登录' }))
    fireEvent.click(screen.getByRole('button', { name: '免登录' }))

    expect(onClick).toHaveBeenCalledTimes(2)
    expect(useUiStore.getState().loginModel).toBe(false)
  })

  it('renders @mentions as links only when the user lookup succeeds', () => {
    vi.mocked(userFeatureMocks.useUserGetByName).mockImplementation((name: string) => ({
      data: name === '小明' ? { id: 'space-1' } : undefined,
    }))

    render(<WithAt>{'你好 @小明 和 @陌生人'}</WithAt>)

    const link = screen.getByRole('link', { name: '@小明' })
    expect(link).toHaveAttribute('href', '/space/space-1')
    expect(screen.getByText('@陌生人')).toBeInTheDocument()
  })

  it('exposes message context values to descendants', () => {
    const Consumer = () => {
      const context = useMessageContext()
      return (
        <button onClick={context.fetchNextPage} type='button'>
          {`${context.messageList.length} messages`}
        </button>
      )
    }

    const fetchNextPageAction = vi.fn()

    render(
      <MessageProvider
        fetchNextPageAction={fetchNextPageAction}
        messageList={[{ id: 'msg-1' }] as never}
      >
        <Consumer />
      </MessageProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: '1 messages' }))
    expect(fetchNextPageAction).toHaveBeenCalledTimes(1)
  })
})
