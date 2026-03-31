import { beforeAll, beforeEach, describe, vi } from 'vitest'
import {
  assertRouteContract,
  createControllerMocks,
  createMiddlewareMocks,
  createRouteApp,
  createUtilsMockModule,
  type RouteContractCase,
} from '@/__test__/utils/route-contract.utils'

const middlewareMocks = createMiddlewareMocks()
const controllerMocks = createControllerMocks([
  'messageCreateConversation',
  'messageDelete',
  'messageDeleteConversation',
  'messageGetConversation',
  'messageList',
  'messageRead',
  'messageSendWhisper',
  'messageStatistics',
] as const)

let app: ReturnType<typeof createRouteApp>

const cases: RouteContractCase[] = [
  {
    controller: 'messageStatistics',
    method: 'get',
    path: '/statistics',
    requiresAuth: true,
  },
  {
    body: {
      content: 'hi there',
      toId: 'user-2',
    },
    controller: 'messageSendWhisper',
    expected: {
      body: {
        content: 'hi there',
        toId: 'user-2',
      },
    },
    method: 'post',
    path: '/send-whisper',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'messageList',
    expected: {
      query: {
        page: '1',
        pageSize: '20',
      },
    },
    method: 'get',
    path: '/',
    query: {
      page: 1,
      pageSize: 20,
    },
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'messageGetConversation',
    expected: {
      params: { userId: 'user-2' },
    },
    method: 'get',
    path: '/conversation/user-2',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'messageCreateConversation',
    expected: {
      params: { userId: 'user-2' },
    },
    method: 'post',
    path: '/conversation/user-2',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'messageDeleteConversation',
    expected: {
      params: { conversationId: 'conversation-1' },
    },
    method: 'delete',
    path: '/conversation/conversation-1',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      type: 'all',
    },
    controller: 'messageRead',
    expected: {
      body: {
        type: 'all',
      },
    },
    method: 'put',
    path: '/read',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    body: {
      type: 'single',
    },
    controller: 'messageRead',
    expected: {
      body: {
        type: 'single',
      },
      params: { id: 'message-1' },
    },
    method: 'put',
    path: '/read/message-1',
    requiresAuth: true,
    usesValidation: true,
  },
  {
    controller: 'messageDelete',
    expected: {
      params: { id: 'message-1' },
    },
    method: 'delete',
    path: '/message-1',
    requiresAuth: true,
    usesValidation: true,
  },
]

describe('messageRoute', () => {
  beforeAll(async () => {
    vi.resetModules()
    vi.doMock('@/utils', createUtilsMockModule)
    vi.doMock('@/middlewares', () => middlewareMocks)
    vi.doMock('@/controllers', () => controllerMocks)

    // @ts-expect-error Vitest resolves TS path aliases at test runtime.
    const { default: messageRoute } = await import('@/routes/message.route')
    app = createRouteApp(messageRoute)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  assertRouteContract({
    cases,
    controllerMocks,
    getApp: () => app,
  })
})
