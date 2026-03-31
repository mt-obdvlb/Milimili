import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeUserStore } from '@/stores/user'
import { getMockProps } from '@/__test__/utils/component.mock'

const featureMocks = vi.hoisted(() => ({
  useVideoDelete: vi.fn(),
  useVideoPageList: vi.fn(),
}))

const libMocks = vi.hoisted(() => ({
  toast: vi.fn(),
}))

vi.mock('@/features', () => featureMocks)
vi.mock('@/lib', async () => {
  const actual = await vi.importActual<object>('@/lib')
  return {
    ...actual,
    toast: libMocks.toast,
  }
})
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a data-href={href} href={href}>
      {children}
    </a>
  ),
}))
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <span data-alt={alt} data-src={src} data-testid='NextImage' />
  ),
}))
vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode
    onValueChange: (value: string) => void
    value: string
  }) => (
    <div data-props={JSON.stringify({ value })} data-testid='Select'>
      <button onClick={() => onValueChange('views')} type='button'>
        sort by views
      </button>
      <button onClick={() => onValueChange('favorites')} type='button'>
        sort by favorites
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`SelectItem-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <div data-testid='SelectValue' />,
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
        next upload page
      </button>
    </div>
  ),
}))
vi.mock('@/components/layout/models/common/CommonDialog', () => ({
  default: ({
    handleConfirm,
    trigger,
  }: {
    handleConfirm: () => Promise<void> | void
    trigger: React.ReactNode
  }) => (
    <div data-testid='CommonDialog'>
      {trigger}
      <button onClick={() => handleConfirm()} type='button'>
        confirm dialog
      </button>
    </div>
  ),
}))
vi.mock('@/components/ui/CoverImage', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <span data-alt={alt} data-src={src} data-testid='CoverImage' />
  ),
}))

import PlatformUploadManagerWrapper from '@/features/platform/components/upload-manager/PlatformUploadManagerWrapper'

describe('PlatformUploadManagerWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    initializeUserStore({
      user: { id: 'user-1', name: 'Milimili' } as never,
    })
    vi.mocked(featureMocks.useVideoDelete).mockReturnValue({
      deleteVideo: vi.fn().mockResolvedValue({ code: 0 }),
    })
    vi.mocked(featureMocks.useVideoPageList).mockReturnValue({
      total: 23,
      videoPageList: [
        {
          comments: 4,
          danmakus: 5,
          favorites: 6,
          id: 'video-1',
          likes: 3,
          publishedAt: '2024-01-01T00:00:00.000Z',
          shares: 7,
          thumbnail: '/thumb.png',
          time: 120,
          title: '投稿视频',
          views: 2,
        },
      ],
    })
  })

  it('requests paged upload videos and reacts to sort and page changes', () => {
    render(<PlatformUploadManagerWrapper />)

    expect(featureMocks.useVideoPageList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      sort: 'publishedAt',
      userId: 'user-1',
    })
    expect(screen.getByText('全部稿件 23')).toBeInTheDocument()
    expect(screen.getByText('投稿视频')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('SpaceCommonPagination'))).toEqual({
      page: 1,
      total: 23,
    })

    fireEvent.click(screen.getByRole('button', { name: 'sort by views' }))
    expect(featureMocks.useVideoPageList).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 10,
      sort: 'views',
      userId: 'user-1',
    })

    fireEvent.click(screen.getByRole('button', { name: 'next upload page' }))
    expect(featureMocks.useVideoPageList).toHaveBeenLastCalledWith({
      page: 2,
      pageSize: 10,
      sort: 'views',
      userId: 'user-1',
    })
  })

  it('deletes a video through the dialog flow and shows a toast on success', async () => {
    const deleteVideo = vi.fn().mockResolvedValue({ code: 0 })
    vi.mocked(featureMocks.useVideoDelete).mockReturnValue({ deleteVideo })

    render(<PlatformUploadManagerWrapper />)

    fireEvent.click(screen.getByRole('button', { name: 'confirm dialog' }))

    await waitFor(() => {
      expect(deleteVideo).toHaveBeenCalledWith('video-1')
    })
    expect(libMocks.toast).toHaveBeenCalledWith('已删除')
  })
})
