import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMockProps } from '@/__test__/utils/component.mock'

const searchApiMocks = vi.hoisted(() => ({
  useSearch: vi.fn(),
}))

const windowScrollMocks = vi.hoisted(() => ({
  useWindowScroll: vi.fn(),
}))

vi.mock('@/features', () => searchApiMocks)
vi.mock('react-use', () => windowScrollMocks)
vi.mock('@/features/search/components/SearchSearchBar', () => ({
  default: ({ kw, searchLogTop10List }: { kw: string; searchLogTop10List?: unknown }) => (
    <div data-props={JSON.stringify({ kw, searchLogTop10List })} data-testid='SearchSearchBar' />
  ),
}))
vi.mock('@/features/search/components/SearchFilterWrapper', () => ({
  default: ({
    publishedAt,
    setPage,
    setPublishedAt,
    setSort,
    setTime,
    sort,
    time,
  }: {
    publishedAt: string
    setPage?: (value: number) => void
    setPublishedAt: (value: 'today') => void
    setSort: (value: 'view') => void
    setTime: (value: '10') => void
    sort: string
    time: string
  }) => (
    <div data-props={JSON.stringify({ publishedAt, sort, time })} data-testid='SearchFilterWrapper'>
      <button onClick={() => setSort('view')} type='button'>
        set sort
      </button>
      <button onClick={() => setTime('10')} type='button'>
        set time
      </button>
      <button onClick={() => setPublishedAt('today')} type='button'>
        set published
      </button>
      <button onClick={() => setPage?.(3)} type='button'>
        set page
      </button>
    </div>
  ),
}))
vi.mock('@/features/search/components/SearchAllList', () => ({
  default: ({
    page,
    searchList,
    searchUser,
    setPage,
    total,
  }: {
    page: number
    searchList: unknown[]
    searchUser?: { user: { id: string } }
    setPage: (value: number) => void
    total: number
  }) => (
    <div
      data-props={JSON.stringify({ page, searchList, searchUser, total })}
      data-testid='SearchAllList'
    >
      <button onClick={() => setPage(page + 1)} type='button'>
        next page
      </button>
    </div>
  ),
}))
vi.mock('@/features/search/components/SearchUserList', () => ({
  default: ({
    page,
    searchList,
    setPage,
    total,
  }: {
    page: number
    searchList: unknown[]
    setPage: (value: number) => void
    total: number
  }) => (
    <div data-props={JSON.stringify({ page, searchList, total })} data-testid='SearchUserList'>
      <button onClick={() => setPage(page + 1)} type='button'>
        next user page
      </button>
    </div>
  ),
}))
vi.mock('@/components', () => {
  const TabsContext = React.createContext<{
    setValue: (value: string) => void
    value: string
  } | null>(null)

  return {
    Separator: ({ className }: { className?: string }) => (
      <div className={className} data-testid='Separator' />
    ),
    Tabs: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode
      onValueChange: (value: string) => void
      value: string
    }) => (
      <TabsContext.Provider value={{ setValue: onValueChange, value }}>
        <div data-testid='Tabs'>{children}</div>
      </TabsContext.Provider>
    ),
    TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => {
      const context = React.useContext(TabsContext)
      if (!context || context.value !== value) return null
      return <div data-testid={`TabsContent-${value}`}>{children}</div>
    },
    TabsList: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='TabsList'>{children}</div>
    ),
    TabsTrigger: ({
      children,
      className,
      value,
    }: {
      children: React.ReactNode
      className?: string
      value: string
    }) => {
      const context = React.useContext(TabsContext)
      return (
        <button className={className} onClick={() => context?.setValue(value)} type='button'>
          {children}
        </button>
      )
    },
  }
})

import SearchWrapper from '@/features/search/components/SearchWrapper'

describe('SearchWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(windowScrollMocks.useWindowScroll).mockReturnValue({ y: 0 } as never)
    vi.mocked(searchApiMocks.useSearch).mockReturnValue({
      searchList: [{ id: 'video-1' }],
      searchUser: { user: { id: 'user-1' } },
      total: 12,
    })
  })

  it('passes query params to useSearch and keeps filter state in sync', () => {
    render(
      <SearchWrapper kw='Milimili' searchLogTop10List={[{ keyword: '推荐词', rank: 1 }] as never} />
    )

    expect(searchApiMocks.useSearch).toHaveBeenCalledWith({
      from: undefined,
      kw: 'Milimili',
      page: 1,
      publishedAt: 'all',
      sort: 'all',
      time: 'all',
      to: undefined,
      type: 'all',
    })
    expect(getMockProps(screen.getByTestId('SearchSearchBar'))).toEqual({
      kw: 'Milimili',
      searchLogTop10List: [{ keyword: '推荐词', rank: 1 }],
    })

    fireEvent.click(screen.getByRole('button', { name: 'set sort' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        sort: 'view',
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'set time' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        time: '10',
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'set published' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        publishedAt: 'today',
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'next page' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 2,
        type: 'all',
      })
    )
  })

  it('switches tabs, hides filters on user search, and enables sticky mode when scrolled', () => {
    vi.mocked(windowScrollMocks.useWindowScroll).mockReturnValue({ y: 320 } as never)

    render(<SearchWrapper kw='Milimili' />)

    const filter = screen.getByTestId('SearchFilterWrapper')
    expect(filter.parentElement?.className).not.toContain('hidden')
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'all',
      })
    )

    fireEvent.click(screen.getByRole('button', { name: '用户' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        type: 'user',
      })
    )
    expect(filter.parentElement?.className).toContain('hidden')
    expect(screen.getByTestId('SearchUserList')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '视频' }))
    expect(searchApiMocks.useSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        type: 'video',
      })
    )
    expect(screen.getByTestId('SearchAllList')).toBeInTheDocument()
  })
})
