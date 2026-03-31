import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeUserStore } from '@/stores/user'
import { createMockComponent, getMockProps } from '@/__test__/utils/component.mock'

const featureMocks = vi.hoisted(() => ({
  useMessageConversationDetail: vi.fn(),
  useUserGetById: vi.fn(),
}))

const navigationMocks = vi.hoisted(() => ({
  useParams: vi.fn(),
}))

vi.mock('@/features', () => featureMocks)
vi.mock('next/navigation', () => navigationMocks)
vi.mock('@/components', () => ({
  ToTopBtnWrapper: createMockComponent('ToTopBtnWrapper'),
}))
vi.mock('@/features/comment/components/CommentWrapper', () => ({
  default: createMockComponent('CommentWrapper'),
}))
vi.mock('@/features/video/components/VideoDanmakuBox', () => ({
  default: createMockComponent('VideoDanmakuBox'),
}))
vi.mock('@/features/video/components/VideoUserContainer', () => ({
  default: createMockComponent('VideoUserContainer'),
}))
vi.mock('@/features/video/components/VideoTagList', () => ({
  default: createMockComponent('VideoTagList'),
}))
vi.mock('@/features/video/components/VideoToolbar', () => ({
  default: createMockComponent('VideoToolbar'),
}))
vi.mock('@/components/hoc/WithAt', () => ({
  default: ({ children }: { children: string }) => <div data-testid='WithAt'>{children}</div>,
}))
vi.mock('@/features/danmaku', () => ({
  DanmakuProvider: ({ children, videoId }: { children: React.ReactNode; videoId: string }) => (
    <div data-props={JSON.stringify({ videoId })} data-testid='DanmakuProvider'>
      {children}
    </div>
  ),
}))
vi.mock('@/features/video/components/video-play/VideoPlayerWrapper', () => ({
  default: ({
    isAutoPlayNext,
    videoDetail,
  }: {
    isAutoPlayNext: boolean
    videoDetail: { video: { id: string } }
  }) => (
    <div
      data-props={JSON.stringify({ isAutoPlayNext, videoId: videoDetail.video.id })}
      data-testid='VideoPlayerWrapper'
    />
  ),
}))
vi.mock('@/features/video/components/VideoRecommendList', () => ({
  default: ({
    isAutoPlayNext,
    setIsAutoPlayNext,
  }: {
    isAutoPlayNext: boolean
    setIsAutoPlayNext: (value: boolean) => void
  }) => (
    <div data-props={JSON.stringify({ isAutoPlayNext })} data-testid='VideoRecommendList'>
      <button onClick={() => setIsAutoPlayNext(true)} type='button'>
        auto play on
      </button>
    </div>
  ),
}))
vi.mock('@/features/message/components/whisper/MessageWhisperConversationItem', () => ({
  default: ({ isMe, message }: { isMe: boolean; message: { content: string; id: string } }) => (
    <div
      data-props={JSON.stringify({ isMe, message })}
      data-testid={`MessageWhisperConversationItem-${message.id}`}
    />
  ),
}))
vi.mock('@/features/message/components/whisper/MessageWhisperSend', () => ({
  default: createMockComponent('MessageWhisperSend'),
}))

import VideoWrapper from '@/features/video/components/VideoWrapper'
import MessageWhisperConversationWrapper from '@/features/message/components/whisper/MessageWhisperConversationWrapper'

describe('video and whisper wrappers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    initializeUserStore({ user: null })
  })

  it('renders video detail shells and syncs autoplay state into the player', () => {
    const videoDetail = {
      tags: ['动画', 'MAD'],
      user: {
        avatar: 'avatar.png',
        id: 'user-1',
        name: 'UP 主',
      },
      video: {
        comments: 5,
        danmakus: 15000,
        description: '@小明 一起看视频',
        favorites: 7,
        id: 'video-1',
        likes: 6,
        publishAt: '2024-01-01T00:00:00.000Z',
        shares: 2,
        thumbnail: 'thumb.png',
        time: 120,
        title: 'Milimili 视频',
        url: '/video',
        views: 23000,
      },
    } as never

    render(<VideoWrapper videoDetail={videoDetail} />)

    expect(screen.getByText('Milimili 视频')).toBeInTheDocument()
    expect(screen.getByText('2万')).toBeInTheDocument()
    expect(screen.getByText('1万')).toBeInTheDocument()
    expect(screen.getByTestId('WithAt')).toHaveTextContent('@小明 一起看视频')
    expect(getMockProps(screen.getByTestId('DanmakuProvider'))).toEqual({ videoId: 'video-1' })
    expect(getMockProps(screen.getByTestId('VideoPlayerWrapper'))).toEqual({
      isAutoPlayNext: false,
      videoId: 'video-1',
    })

    fireEvent.click(screen.getByRole('button', { name: 'auto play on' }))

    expect(getMockProps(screen.getByTestId('VideoPlayerWrapper'))).toEqual({
      isAutoPlayNext: true,
      videoId: 'video-1',
    })
    expect(screen.getByTestId('VideoTagList')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('CommentWrapper'))).toEqual({ videoId: 'video-1' })
  })

  it('skips tag and description blocks when both are empty', () => {
    const videoDetail = {
      tags: [],
      user: { id: 'user-1', name: 'UP 主' },
      video: {
        danmakus: 0,
        description: '',
        id: 'video-2',
        publishAt: '2024-01-01T00:00:00.000Z',
        title: '空描述视频',
        views: 1,
      },
    } as never

    render(<VideoWrapper videoDetail={videoDetail} />)

    expect(screen.queryByTestId('WithAt')).not.toBeInTheDocument()
    expect(screen.queryByTestId('VideoTagList')).not.toBeInTheDocument()
  })

  it('renders whisper conversation groups and handles missing state safely', () => {
    navigationMocks.useParams.mockReturnValue({ userId: 'target-user' })
    initializeUserStore({
      user: { id: 'current-user', name: '我' } as never,
    })
    vi.mocked(featureMocks.useUserGetById).mockReturnValue({
      user: { id: 'target-user', name: '对方' },
    })
    vi.mocked(featureMocks.useMessageConversationDetail).mockReturnValue({
      conversation: [
        {
          conversations: [
            {
              content: '你好',
              id: 'msg-1',
              user: { id: 'current-user', name: '我' },
            },
            {
              content: '在吗',
              id: 'msg-2',
              user: { id: 'target-user', name: '对方' },
            },
          ],
          date: '2024-01-01T00:00:00.000Z',
        },
      ],
    })

    const { rerender } = render(<MessageWhisperConversationWrapper />)

    expect(screen.getByText('对方')).toBeInTheDocument()
    expect(screen.getByText(/2024年1月1日|今天|昨天/)).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('MessageWhisperConversationItem-msg-1'))).toEqual({
      isMe: true,
      message: {
        content: '你好',
        id: 'msg-1',
        user: { id: 'current-user', name: '我' },
      },
    })
    expect(getMockProps(screen.getByTestId('MessageWhisperConversationItem-msg-2'))).toEqual({
      isMe: false,
      message: {
        content: '在吗',
        id: 'msg-2',
        user: { id: 'target-user', name: '对方' },
      },
    })
    expect(getMockProps(screen.getByTestId('MessageWhisperSend'))).toEqual({
      userId: 'target-user',
    })

    vi.mocked(featureMocks.useMessageConversationDetail).mockReturnValue({
      conversation: undefined,
    })
    rerender(<MessageWhisperConversationWrapper />)
    expect(screen.queryByText('对方')).not.toBeInTheDocument()
  })
})
