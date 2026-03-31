import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeUserStore } from '@/stores/user'
import { getMockProps } from '@/__test__/utils/component.mock'

const featureMocks = vi.hoisted(() => ({
  useFavoriteDetail: vi.fn(),
  useFavoriteGetFolderList: vi.fn(),
  useFavoriteList: vi.fn(),
}))

const navigationMocks = vi.hoisted(() => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}))

vi.mock('@/features', () => featureMocks)
vi.mock('next/navigation', () => navigationMocks)
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <span data-alt={alt} data-src={src} data-testid='NextImage' />
  ),
}))

vi.mock('@/features/space/components/favorite/SpaceFavoriteFilterWrapper', () => ({
  default: ({
    favoriteList,
    ids,
    isMe,
    isSelect,
    kw,
    setIds,
    setIsSelect,
    setKw,
    setSort,
    sort,
  }: {
    favoriteList: unknown[]
    ids: { favoriteId: string; videoId: string }[]
    isMe: boolean
    isSelect: boolean
    kw: string
    setIds: (value: { favoriteId: string; videoId: string }[]) => void
    setIsSelect: (value: boolean) => void
    setKw: (value: string) => void
    setSort: (value: 'views') => void
    sort: string
  }) => (
    <div
      data-props={JSON.stringify({ favoriteList, ids, isMe, isSelect, kw, sort })}
      data-testid='SpaceFavoriteFilterWrapper'
    >
      <button onClick={() => setSort('views')} type='button'>
        set favorite sort
      </button>
      <button onClick={() => setKw('search-kw')} type='button'>
        set favorite kw
      </button>
      <button onClick={() => setIds([{ favoriteId: 'fav-1', videoId: 'video-1' }])} type='button'>
        set favorite ids
      </button>
      <button onClick={() => setIsSelect(false)} type='button'>
        close favorite select
      </button>
    </div>
  ),
}))

vi.mock('@/features/space/components/common/SpaceCommonPagination', () => ({
  default: ({
    page,
    setPage,
    total,
  }: {
    page: number
    setPage: (value: number) => void
    total: number
  }) => (
    <div data-props={JSON.stringify({ page, total })} data-testid='SpaceCommonPagination'>
      <button onClick={() => setPage(page + 1)} type='button'>
        next favorite page
      </button>
    </div>
  ),
}))

vi.mock('@/components/layout/video/TinyVideoItem', () => ({
  default: ({
    hiddenPublishAt,
    showFavoriteAt,
    showWatchLater,
    video,
  }: {
    hiddenPublishAt?: boolean
    showFavoriteAt?: boolean
    showWatchLater?: boolean
    video: unknown
  }) => (
    <div
      data-props={JSON.stringify({ hiddenPublishAt, showFavoriteAt, showWatchLater, video })}
      data-testid='TinyVideoItem'
    />
  ),
}))

vi.mock('@/features/favorite/components/FavoriteCheckBox', () => ({
  default: ({
    id,
    ids,
  }: {
    id: { favoriteId: string; videoId: string }
    ids: { favoriteId: string; videoId: string }[]
  }) => <div data-props={JSON.stringify({ id, ids })} data-testid='FavoriteCheckBox' />,
}))

vi.mock('@/features/space/components/home/SpaceHomeHeader', () => ({
  default: ({ desc, title, url }: { desc?: string; title: string; url: string }) => (
    <div data-props={JSON.stringify({ desc, title, url })} data-testid='SpaceHomeHeader' />
  ),
}))

vi.mock('@/features/space/components/home/SpaceHomeFavoriteItem', () => ({
  default: ({ favoriteFolder, userId }: { favoriteFolder: { id: string }; userId: string }) => (
    <div
      data-props={JSON.stringify({ favoriteFolder, userId })}
      data-testid={`SpaceHomeFavoriteItem-${favoriteFolder.id}`}
    />
  ),
}))

vi.mock('@/features/space/components/common/SpaceCommonTabs', () => ({
  default: ({
    link,
    tabs,
    type,
  }: {
    link?: boolean
    tabs: { name: string; value: string }[]
    type: string
  }) => <div data-props={JSON.stringify({ link, tabs, type })} data-testid='SpaceCommonTabs' />,
}))

import SpaceFavoriteWrapper from '@/features/space/components/favorite/SpaceFavoriteWrapper'
import SpaceHomeFavoriteWrapper from '@/features/space/components/home/SpaceHomeFavoriteWrapper'
import SpaceUploadWrapper from '@/features/space/components/upload/SpaceUploadWrapper'

describe('space wrappers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    initializeUserStore({
      user: { id: 'user-1', name: 'Milimili' } as never,
    })
    navigationMocks.useSearchParams.mockReturnValue({
      get: (key: string) => (key === 'folderId' ? 'folder-1' : null),
    })
    navigationMocks.usePathname.mockReturnValue('/space/user-1/upload/video')
    vi.mocked(featureMocks.useFavoriteDetail).mockReturnValue({
      favoriteDetail: {
        id: 'folder-1',
        name: '默认收藏夹',
        number: 3,
        thumbnail: '/thumb.png',
        type: 'default',
      },
    })
    vi.mocked(featureMocks.useFavoriteList).mockReturnValue({
      favoriteList: [
        {
          favoriteAt: '2024-01-01T00:00:00.000Z',
          id: 'fav-1',
          user: { id: 'user-1', name: 'Milimili' },
          video: { id: 'video-1', title: '视频一' },
        },
      ],
      total: 11,
    })
    vi.mocked(featureMocks.useFavoriteGetFolderList).mockReturnValue({
      favoriteFolderList: Array.from({ length: 12 }, (_, index) => ({
        id: `folder-${index + 1}`,
        name: `收藏夹 ${index + 1}`,
      })),
    })
  })

  it('renders SpaceFavoriteWrapper with folder data, pagination, and batch-select flow', () => {
    render(<SpaceFavoriteWrapper userId='user-1' />)

    expect(featureMocks.useFavoriteList).toHaveBeenCalledWith({
      favoriteFolderId: 'folder-1',
      kw: '',
      page: 1,
      pageSize: 50,
      sort: 'favoriteAt',
    })
    expect(screen.getByText('默认收藏夹')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('SpaceFavoriteFilterWrapper'))).toEqual({
      favoriteList: [
        {
          favoriteAt: '2024-01-01T00:00:00.000Z',
          id: 'fav-1',
          user: { id: 'user-1', name: 'Milimili' },
          video: { id: 'video-1', title: '视频一' },
        },
      ],
      ids: [],
      isMe: true,
      isSelect: false,
      kw: '',
      sort: 'favoriteAt',
    })

    fireEvent.click(screen.getByRole('button', { name: '批量操作' }))
    expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'set favorite ids' }))
    expect(getMockProps(screen.getByTestId('FavoriteCheckBox'))).toEqual({
      id: { favoriteId: 'fav-1', videoId: 'video-1' },
      ids: [{ favoriteId: 'fav-1', videoId: 'video-1' }],
    })

    fireEvent.click(screen.getByRole('button', { name: 'set favorite sort' }))
    fireEvent.click(screen.getByRole('button', { name: 'set favorite kw' }))
    expect(featureMocks.useFavoriteList).toHaveBeenLastCalledWith({
      favoriteFolderId: 'folder-1',
      kw: 'search-kw',
      page: 1,
      pageSize: 50,
      sort: 'views',
    })

    fireEvent.click(screen.getByRole('button', { name: 'next favorite page' }))
    expect(featureMocks.useFavoriteList).toHaveBeenLastCalledWith({
      favoriteFolderId: 'folder-1',
      kw: 'search-kw',
      page: 2,
      pageSize: 50,
      sort: 'views',
    })
  })

  it('renders only the first 10 folders in SpaceHomeFavoriteWrapper', () => {
    render(<SpaceHomeFavoriteWrapper userId='user-1' />)

    expect(getMockProps(screen.getByTestId('SpaceHomeHeader'))).toEqual({
      desc: '12',
      title: '收藏夹',
      url: '/space/user-1/favorite',
    })
    expect(screen.getByTestId('SpaceHomeFavoriteItem-folder-1')).toBeInTheDocument()
    expect(screen.getByTestId('SpaceHomeFavoriteItem-folder-10')).toBeInTheDocument()
    expect(screen.queryByTestId('SpaceHomeFavoriteItem-folder-11')).not.toBeInTheDocument()
  })

  it('tracks upload tab type from pathname in SpaceUploadWrapper', () => {
    const { rerender } = render(
      <SpaceUploadWrapper>
        <div data-testid='space-upload-child'>child</div>
      </SpaceUploadWrapper>
    )

    expect(getMockProps(screen.getByTestId('SpaceCommonTabs'))).toEqual({
      link: true,
      tabs: [
        { name: '视频', value: 'video' },
        { name: '图文', value: 'feed' },
      ],
      type: 'video',
    })

    navigationMocks.usePathname.mockReturnValue('/space/user-1/upload/feed')
    rerender(
      <SpaceUploadWrapper>
        <div data-testid='space-upload-child'>child</div>
      </SpaceUploadWrapper>
    )

    expect(getMockProps(screen.getByTestId('SpaceCommonTabs'))).toEqual({
      link: true,
      tabs: [
        { name: '视频', value: 'video' },
        { name: '图文', value: 'feed' },
      ],
      type: 'feed',
    })
    expect(screen.getByTestId('space-upload-child')).toBeInTheDocument()
  })
})
