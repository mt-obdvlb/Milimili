import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createMockComponent, getMockProps } from '@/__test__/utils/component.mock'

describe('server data pages and layouts', () => {
  it('renders the feed home page with fetched sidebar data', async () => {
    vi.resetModules()

    const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
    const ToTopBtn = createMockComponent('ToTopBtn')
    const FeedAsideTop10List = createMockComponent('FeedAsideTop10List')
    const FeedMainWrapper = createMockComponent('FeedMainWrapper')
    const CoverImage = createMockComponent('CoverImage')
    const NextLink = createMockComponent('NextLink')
    const getSearchLogTop10 = vi.fn().mockResolvedValue({
      searchLogTop10List: ['动画', '番剧'],
    })
    const getUserHomeInfo = vi.fn().mockResolvedValue({
      userHomeInfo: {
        feeds: 3,
        followers: 2,
        followings: 1,
        user: {
          avatar: '/avatar.png',
          id: 'user-1',
          name: 'milimili',
        },
      },
    })

    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/components/ui/ToTopBtn', () => ({ default: ToTopBtn }))
    vi.doMock('@/features/feed/components/FeedAsideTop10List', () => ({
      default: FeedAsideTop10List,
    }))
    vi.doMock('@/features/feed/components/FeedMainWrapper', () => ({
      default: FeedMainWrapper,
    }))
    vi.doMock('@/components/ui/CoverImage', () => ({ default: CoverImage }))
    vi.doMock('next/link', () => ({
      default: NextLink,
    }))
    vi.doMock('@/features', () => ({
      getSearchLogTop10,
      getUserHomeInfo,
    }))

    const mod = await import('@/app/(with-auth)/feed/page')
    render(await mod.default())

    expect(screen.getByText('milimili')).toBeInTheDocument()
    expect(screen.getByText('关注')).toBeInTheDocument()
    expect(screen.getByText('粉丝')).toBeInTheDocument()
    expect(screen.getByText('动态')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('FeedAsideTop10List'))).toEqual({
      searchLogTop10List: ['动画', '番剧'],
    })
    expect(screen.getByTestId('FeedMainWrapper')).toBeInTheDocument()
    expect(screen.getByTestId('ToTopBtn')).toBeInTheDocument()
  })

  it('renders feed detail only when the feed exists', async () => {
    vi.resetModules()

    const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
    const FeedDetailMainWrapper = createMockComponent('FeedDetailMainWrapper')
    const FeedDetailToolBar = createMockComponent('FeedDetailToolBar')
    const feedGetById = vi.fn().mockResolvedValue({
      data: {
        id: 'feed-1',
        type: 'image-text',
      },
    })

    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/features/feed/components/detail/FeedDetailMainWrapper', () => ({
      default: FeedDetailMainWrapper,
    }))
    vi.doMock('@/features/feed/components/detail/FeedDetailToolBar', () => ({
      default: FeedDetailToolBar,
    }))
    vi.doMock('@/services', () => ({
      feedGetById,
    }))

    const mod = await import('@/app/(with-auth)/feed/[feedId]/page')
    const firstRender = render(await mod.default({ params: Promise.resolve({ feedId: 'feed-1' }) }))

    expect(feedGetById).toHaveBeenCalledWith('feed-1')
    expect(getMockProps(screen.getByTestId('FeedDetailMainWrapper'))).toEqual({
      feed: {
        id: 'feed-1',
        type: 'image-text',
      },
    })
    expect(getMockProps(screen.getByTestId('FeedDetailToolBar'))).toEqual({
      feed: {
        id: 'feed-1',
        type: 'image-text',
      },
    })
    firstRender.unmount()

    vi.resetModules()
    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/features/feed/components/detail/FeedDetailMainWrapper', () => ({
      default: FeedDetailMainWrapper,
    }))
    vi.doMock('@/features/feed/components/detail/FeedDetailToolBar', () => ({
      default: FeedDetailToolBar,
    }))
    vi.doMock('@/services', () => ({
      feedGetById: vi.fn().mockResolvedValue({ data: null }),
    }))

    const noFeedMod = await import('@/app/(with-auth)/feed/[feedId]/page')
    render(await noFeedMod.default({ params: Promise.resolve({ feedId: 'feed-2' }) }))
    expect(screen.queryByTestId('FeedDetailMainWrapper')).not.toBeInTheDocument()
  })

  it('renders the video detail page and fallback state', async () => {
    vi.resetModules()

    const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
    const VideoWrapper = createMockComponent('VideoWrapper')
    const getVideoDetail = vi.fn().mockResolvedValue({
      videoDetail: {
        id: 'video-1',
      },
    })

    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/features/video/components/VideoWrapper', () => ({
      default: VideoWrapper,
    }))
    vi.doMock('@/features', () => ({
      getVideoDetail,
    }))

    const mod = await import('@/app/(with-auth)/video/[videoId]/page')
    render(await mod.default({ params: Promise.resolve({ videoId: 'video-1' }) }))
    expect(getMockProps(screen.getByTestId('VideoWrapper'))).toEqual({
      videoDetail: {
        id: 'video-1',
      },
    })

    vi.resetModules()
    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/features/video/components/VideoWrapper', () => ({
      default: VideoWrapper,
    }))
    vi.doMock('@/features', () => ({
      getVideoDetail: vi.fn().mockResolvedValue({
        videoDetail: null,
      }),
    }))

    const fallbackMod = await import('@/app/(with-auth)/video/[videoId]/page')
    render(await fallbackMod.default({ params: Promise.resolve({ videoId: 'video-2' }) }))
    expect(screen.getByText('暂无内容')).toBeInTheDocument()
  })

  it('renders the space layout for valid users and redirects otherwise', async () => {
    vi.resetModules()

    const SpaceHeader = createMockComponent('SpaceHeader')
    const SpaceTabs = createMockComponent('SpaceTabs')
    const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
    const ToTopBtnWrapper = createMockComponent('ToTopBtnWrapper')
    const getUserById = vi.fn().mockResolvedValue({
      data: {
        id: 'user-1',
        name: 'milimili',
      },
    })
    const redirect = vi.fn()

    vi.doMock('@/features/space/components/SpaceHeader', () => ({ default: SpaceHeader }))
    vi.doMock('@/features/space/components/SpaceTabs', () => ({ default: SpaceTabs }))
    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/components', () => ({
      ToTopBtnWrapper,
    }))
    vi.doMock('@/services', () => ({
      getUserById,
    }))
    vi.doMock('next/navigation', () => ({
      redirect,
    }))

    const mod = await import('@/app/(with-auth)/space/[userId]/layout')
    render(
      await mod.default({
        children: <div>space-child</div>,
        params: Promise.resolve({ userId: 'user-1' }),
      })
    )

    expect(getUserById).toHaveBeenCalledWith('user-1')
    expect(getMockProps(screen.getByTestId('SpaceHeader'))).toEqual({
      user: {
        id: 'user-1',
        name: 'milimili',
      },
    })
    expect(getMockProps(screen.getByTestId('SpaceTabs'))).toEqual({
      user: {
        id: 'user-1',
        name: 'milimili',
      },
    })
    expect(screen.getByText('space-child')).toBeInTheDocument()

    vi.resetModules()
    vi.doMock('@/features/space/components/SpaceHeader', () => ({ default: SpaceHeader }))
    vi.doMock('@/features/space/components/SpaceTabs', () => ({ default: SpaceTabs }))
    vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
      default: HeaderBarWrapper,
    }))
    vi.doMock('@/components', () => ({
      ToTopBtnWrapper,
    }))
    const missingRedirect = vi.fn()
    vi.doMock('@/services', () => ({
      getUserById: vi.fn().mockResolvedValue({ data: null }),
    }))
    vi.doMock('next/navigation', () => ({
      redirect: missingRedirect,
    }))

    const missingMod = await import('@/app/(with-auth)/space/[userId]/layout')
    await missingMod.default({
      children: <div>space-child</div>,
      params: Promise.resolve({ userId: 'user-404' }),
    })
    expect(missingRedirect).toHaveBeenCalledWith('/space')
  })
})
