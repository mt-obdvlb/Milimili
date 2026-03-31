import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createMockComponent, getMockProps } from '@/__test__/utils/component.mock'

const loadSimplePage = async (importPath: string, componentModules: Record<string, unknown>) => {
  vi.resetModules()
  for (const [path, moduleValue] of Object.entries(componentModules)) {
    vi.doMock(path, () => moduleValue)
  }
  return import(importPath)
}

describe('with-auth shell pages', () => {
  it('renders account, history, and watch-later shells', async () => {
    const HeaderBarTypeTwoWrapper = createMockComponent('HeaderBarTypeTwoWrapper')
    const AccountWrapper = createMockComponent('AccountWrapper')
    const HistoryWrapper = createMockComponent('HistoryWrapper')
    const WatchLaterWrapper = createMockComponent('WatchLaterWrapper')

    const account = await loadSimplePage('@/app/(with-auth)/account/page', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/features/account/components/AccountWrapper': { default: AccountWrapper },
    })
    const accountRender = render(account.default())
    expect(screen.getByTestId('AccountWrapper')).toBeInTheDocument()
    accountRender.unmount()

    const history = await loadSimplePage('@/app/(with-auth)/history/page', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/features/history/components/HistoryWrapper': { default: HistoryWrapper },
    })
    const historyRender = render(history.default())
    expect(screen.getByTestId('HistoryWrapper')).toBeInTheDocument()
    historyRender.unmount()

    const watchLater = await loadSimplePage('@/app/(with-auth)/watch-later/page', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/features/watch-later/components/WatchLaterWrapper': { default: WatchLaterWrapper },
    })
    render(watchLater.default())
    expect(screen.getByTestId('WatchLaterWrapper')).toBeInTheDocument()
  })

  it('renders all message tab pages', async () => {
    const MessageCommonHeader = createMockComponent('MessageCommonHeader')
    const MessageAtList = createMockComponent('MessageAtList')
    const MessageLikeList = createMockComponent('MessageLikeList')
    const MessageReplyList = createMockComponent('MessageReplyList')
    const MessageSystemList = createMockComponent('MessageSystemList')

    const at = await loadSimplePage('@/app/(with-auth)/message/at/page', {
      '@/features/message/components/common/MessageCommonHeader': { default: MessageCommonHeader },
      '@/features/message/components/at/MessageAtList': { default: MessageAtList },
    })
    const atRender = render(at.default())
    expect(getMockProps(screen.getByTestId('MessageCommonHeader'))).toEqual({ title: '@ 我的' })
    expect(screen.getByTestId('MessageAtList')).toBeInTheDocument()
    atRender.unmount()

    const like = await loadSimplePage('@/app/(with-auth)/message/like/page', {
      '@/features/message/components/common/MessageCommonHeader': { default: MessageCommonHeader },
      '@/features/message/components/like/MessageLikeList': { default: MessageLikeList },
    })
    const likeRender = render(like.default())
    expect(getMockProps(screen.getByTestId('MessageCommonHeader'))).toEqual({ title: '收到的赞' })
    expect(screen.getByTestId('MessageLikeList')).toBeInTheDocument()
    likeRender.unmount()

    const reply = await loadSimplePage('@/app/(with-auth)/message/reply/page', {
      '@/features/message/components/common/MessageCommonHeader': { default: MessageCommonHeader },
      '@/features/message/components/reply/MessageReplyList': { default: MessageReplyList },
    })
    const replyRender = render(reply.default())
    expect(getMockProps(screen.getByTestId('MessageCommonHeader'))).toEqual({ title: '回复我的' })
    expect(screen.getByTestId('MessageReplyList')).toBeInTheDocument()
    replyRender.unmount()

    const system = await loadSimplePage('@/app/(with-auth)/message/system/page', {
      '@/features/message/components/common/MessageCommonHeader': { default: MessageCommonHeader },
      '@/features/message/components/system/MessageSystemList': { default: MessageSystemList },
    })
    render(system.default())
    expect(getMockProps(screen.getByTestId('MessageCommonHeader'))).toEqual({ title: '系统通知' })
    expect(screen.getByTestId('MessageSystemList')).toBeInTheDocument()
  })

  it('renders whisper pages and conversation shell', async () => {
    const CoverImage = createMockComponent('CoverImage')
    const MessageWhisperConversationWrapper = createMockComponent(
      'MessageWhisperConversationWrapper'
    )

    const whisper = await loadSimplePage('@/app/(with-auth)/message/whisper/page', {
      '@/components/ui/CoverImage': { default: CoverImage },
    })
    const whisperRender = render(whisper.default())
    expect(screen.getByTestId('CoverImage')).toBeInTheDocument()
    expect(screen.getByText('快找小伙伴聊天吧 ( ゜- ゜)つロ')).toBeInTheDocument()
    whisperRender.unmount()

    const whisperId = await loadSimplePage('@/app/(with-auth)/message/whisper/[userId]/page', {
      '@/features/message/components/whisper/MessageWhisperConversationWrapper': {
        default: MessageWhisperConversationWrapper,
      },
    })
    render(whisperId.default())
    expect(screen.getByTestId('MessageWhisperConversationWrapper')).toBeInTheDocument()
  })

  it('renders platform upload pages', async () => {
    const PlatformUploadWrapper = createMockComponent('PlatformUploadWrapper')
    const PlatformUploadManagerWrapper = createMockComponent('PlatformUploadManagerWrapper')

    const upload = await loadSimplePage('@/app/(with-auth)/platform/upload/page', {
      '@/features/platform/components/upload/PlatformUploadWrapper': {
        default: PlatformUploadWrapper,
      },
    })
    const uploadRender = render(upload.default())
    expect(screen.getByTestId('PlatformUploadWrapper')).toBeInTheDocument()
    uploadRender.unmount()

    const manager = await loadSimplePage('@/app/(with-auth)/platform/upload-manager/page', {
      '@/features/platform/components/upload-manager/PlatformUploadManagerWrapper': {
        default: PlatformUploadManagerWrapper,
      },
    })
    render(manager.default())
    expect(screen.getByTestId('PlatformUploadManagerWrapper')).toBeInTheDocument()
    expect(screen.getByText('视频投稿')).toBeInTheDocument()
  })

  it('renders space child pages with resolved user ids', async () => {
    const SpaceFavoriteWrapper = createMockComponent('SpaceFavoriteWrapper')
    const SpaceFavoriteAside = createMockComponent('SpaceFavoriteAside')
    const SpaceFeedWrapper = createMockComponent('SpaceFeedWrapper')
    const SpaceHomeFavoriteWrapper = createMockComponent('SpaceHomeFavoriteWrapper')
    const SpaceHomeLikeListWrapper = createMockComponent('SpaceHomeLikeListWrapper')
    const SpaceRelationWrapper = createMockComponent('SpaceRelationWrapper')
    const SpaceUploadFeedList = createMockComponent('SpaceUploadFeedList')
    const SpaceUploadVideoWrapper = createMockComponent('SpaceUploadVideoWrapper')

    const favorite = await loadSimplePage('@/app/(with-auth)/space/[userId]/favorite/page', {
      '@/features/space/components/favorite/SpaceFavoriteWrapper': {
        default: SpaceFavoriteWrapper,
      },
      '@/features/space/components/favorite/SpaceFavoriteAside': { default: SpaceFavoriteAside },
    })
    const favoriteRender = render(
      await favorite.default({ params: Promise.resolve({ userId: 'user-1' }) })
    )
    expect(getMockProps(screen.getByTestId('SpaceFavoriteAside'))).toEqual({ userId: 'user-1' })
    expect(getMockProps(screen.getByTestId('SpaceFavoriteWrapper'))).toEqual({ userId: 'user-1' })
    favoriteRender.unmount()

    const feed = await loadSimplePage('@/app/(with-auth)/space/[userId]/feed/page', {
      '@/features/space/components/feed/SpaceFeedWrapper': { default: SpaceFeedWrapper },
    })
    const feedRender = render(await feed.default({ params: Promise.resolve({ userId: 'user-1' }) }))
    expect(getMockProps(screen.getByTestId('SpaceFeedWrapper'))).toEqual({ userId: 'user-1' })
    feedRender.unmount()

    const home = await loadSimplePage('@/app/(with-auth)/space/[userId]/page', {
      '@/features/space/components/home/SpaceHomeFavoriteWrapper': {
        default: SpaceHomeFavoriteWrapper,
      },
      '@/features/space/components/home/SpaceHomeLikeListWrapper': {
        default: SpaceHomeLikeListWrapper,
      },
      'next/navigation': {
        redirect: vi.fn(),
      },
    })
    const homeRender = render(await home.default({ params: Promise.resolve({ userId: 'user-1' }) }))
    expect(getMockProps(screen.getByTestId('SpaceHomeFavoriteWrapper'))).toEqual({
      userId: 'user-1',
    })
    expect(getMockProps(screen.getByTestId('SpaceHomeLikeListWrapper'))).toEqual({
      userId: 'user-1',
    })
    homeRender.unmount()

    const fans = await loadSimplePage('@/app/(with-auth)/space/[userId]/relation/fans/page', {
      '@/features/space/components/relation/SpaceRelationWrapper': {
        default: SpaceRelationWrapper,
      },
    })
    const fansRender = render(await fans.default({ params: Promise.resolve({ userId: 'user-1' }) }))
    expect(getMockProps(screen.getByTestId('SpaceRelationWrapper'))).toEqual({
      title: '全部粉丝',
      type: 'follower',
      userId: 'user-1',
    })
    fansRender.unmount()

    const follow = await loadSimplePage('@/app/(with-auth)/space/[userId]/relation/follow/page', {
      '@/features/space/components/relation/SpaceRelationWrapper': {
        default: SpaceRelationWrapper,
      },
    })
    const followRender = render(
      await follow.default({ params: Promise.resolve({ userId: 'user-1' }) })
    )
    expect(getMockProps(screen.getByTestId('SpaceRelationWrapper'))).toEqual({
      title: '全部关注',
      type: 'following',
      userId: 'user-1',
    })
    followRender.unmount()

    const uploadFeed = await loadSimplePage('@/app/(with-auth)/space/[userId]/upload/feed/page', {
      '@/features/space/components/upload/SpaceUploadFeedList': { default: SpaceUploadFeedList },
    })
    const uploadFeedRender = render(
      await uploadFeed.default({ params: Promise.resolve({ userId: 'user-1' }) })
    )
    expect(getMockProps(screen.getByTestId('SpaceUploadFeedList'))).toEqual({ userId: 'user-1' })
    uploadFeedRender.unmount()

    const uploadVideo = await loadSimplePage('@/app/(with-auth)/space/[userId]/upload/video/page', {
      '@/features/space/components/upload/SpaceUploadVideoWrapper': {
        default: SpaceUploadVideoWrapper,
      },
    })
    render(await uploadVideo.default({ params: Promise.resolve({ userId: 'user-1' }) }))
    expect(getMockProps(screen.getByTestId('SpaceUploadVideoWrapper'))).toEqual({
      userId: 'user-1',
    })
  })
})
