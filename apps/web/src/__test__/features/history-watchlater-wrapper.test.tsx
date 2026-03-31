import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMockProps } from '@/__test__/utils/component.mock'

const featureMocks = vi.hoisted(() => ({
  useHistoryList: vi.fn(),
}))

const hookMocks = vi.hoisted(() => ({
  useInfiniteScroll: vi.fn(),
}))

const intersectionMocks = vi.hoisted(() => ({
  useInView: vi.fn(),
}))

const watchLaterApiMocks = vi.hoisted(() => ({
  useWatchLaterList: vi.fn(),
}))

vi.mock('@/features', () => featureMocks)
vi.mock('@/hooks', () => hookMocks)
vi.mock('react-intersection-observer', () => intersectionMocks)
vi.mock('@/features/watch-later/api', () => watchLaterApiMocks)

vi.mock('@/features/history/components/HistoryTitle', () => ({
  default: ({
    isDetail,
    setIsDetail,
  }: {
    isDetail: boolean
    setIsDetail: (value: boolean) => void
  }) => (
    <div data-props={JSON.stringify({ isDetail })} data-testid='HistoryTitle'>
      <button onClick={() => setIsDetail(true)} type='button'>
        detail on
      </button>
    </div>
  ),
}))

vi.mock('@/features/history/components/HistoryFilterWrapper', () => ({
  default: ({
    ids,
    isDetail,
    isSelect,
    isSticky,
    open,
    setIds,
    setIsSelect,
    setKw,
    setOpen,
    setTime,
    setWatchAt,
  }: {
    ids: string[]
    isDetail: boolean
    isSelect: boolean
    isSticky: boolean
    open: boolean
    setIds: (value: string[]) => void
    setIsSelect: (value: boolean) => void
    setKw: (value: string) => void
    setOpen: (value: boolean) => void
    setTime: (value: '10') => void
    setWatchAt: (value: 'today') => void
  }) => (
    <div
      data-props={JSON.stringify({ ids, isDetail, isSelect, isSticky, open })}
      data-testid='HistoryFilterWrapper'
    >
      <button onClick={() => setTime('10')} type='button'>
        set history time
      </button>
      <button onClick={() => setWatchAt('today')} type='button'>
        set history watchAt
      </button>
      <button onClick={() => setKw('Milimili')} type='button'>
        set history kw
      </button>
      <button onClick={() => setIds(['history-1'])} type='button'>
        set history ids
      </button>
      <button onClick={() => setIsSelect(true)} type='button'>
        set history select
      </button>
      <button onClick={() => setOpen(true)} type='button'>
        set history open
      </button>
    </div>
  ),
}))

vi.mock('@/features/history/components/HistoryVideoList', () => ({
  default: ({
    historyList,
    ids,
    isDetail,
    isSelect,
    isSticky,
  }: {
    historyList?: unknown[]
    ids: string[]
    isDetail: boolean
    isSelect: boolean
    isSticky: boolean
  }) => (
    <div
      data-props={JSON.stringify({ historyList, ids, isDetail, isSelect, isSticky })}
      data-testid='HistoryVideoList'
    />
  ),
}))

vi.mock('@/features/watch-later/components/WatchLaterTitle', () => ({
  default: ({
    isDetail,
    setIsDetail,
    setSort,
    sort,
    total,
  }: {
    isDetail: boolean
    setIsDetail: (value: boolean) => void
    setSort: (value: 'favoriteAt') => void
    sort: string
    total?: number
  }) => (
    <div data-props={JSON.stringify({ isDetail, sort, total })} data-testid='WatchLaterTitle'>
      <button onClick={() => setIsDetail(true)} type='button'>
        watch detail on
      </button>
      <button onClick={() => setSort('favoriteAt')} type='button'>
        watch set sort
      </button>
    </div>
  ),
}))

vi.mock('@/features/watch-later/components/WatchLaterFilterWrapper', () => ({
  default: ({
    addAt,
    ids,
    isDetail,
    isSelect,
    setAddAt,
    setIds,
    setIsSelect,
    setKw,
    setTime,
    setType,
    time,
    type,
  }: {
    addAt: string
    ids: { favoriteId: string; videoId: string }[]
    isDetail: boolean
    isSelect: boolean
    setAddAt: (value: 'today') => void
    setIds: (value: { favoriteId: string; videoId: string }[]) => void
    setIsSelect: (value: boolean) => void
    setKw: (value: string) => void
    setTime: (value: '10') => void
    setType: (value: 'not_watched') => void
    time: string
    type: string
  }) => (
    <div
      data-props={JSON.stringify({ addAt, ids, isDetail, isSelect, time, type })}
      data-testid='WatchLaterFilterWrapper'
    >
      <button onClick={() => setType('not_watched')} type='button'>
        watch set type
      </button>
      <button onClick={() => setTime('10')} type='button'>
        watch set time
      </button>
      <button onClick={() => setAddAt('today')} type='button'>
        watch set addAt
      </button>
      <button onClick={() => setKw('later')} type='button'>
        watch set kw
      </button>
      <button onClick={() => setIds([{ favoriteId: 'fav-1', videoId: 'video-1' }])} type='button'>
        watch set ids
      </button>
      <button onClick={() => setIsSelect(true)} type='button'>
        watch set select
      </button>
    </div>
  ),
}))

vi.mock('@/features/watch-later/components/WatchLaterVideoList', () => ({
  default: ({
    ids,
    isDetail,
    isSelect,
    videoWatchLaterList,
  }: {
    ids: { favoriteId: string; videoId: string }[]
    isDetail: boolean
    isSelect: boolean
    videoWatchLaterList?: unknown[]
  }) => (
    <div
      data-props={JSON.stringify({ ids, isDetail, isSelect, videoWatchLaterList })}
      data-testid='WatchLaterVideoList'
    />
  ),
}))

import HistoryWrapper from '@/features/history/components/HistoryWrapper'
import WatchLaterWrapper from '@/features/watch-later/components/WatchLaterWrapper'

describe('history and watch-later wrappers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(featureMocks.useHistoryList).mockReturnValue({
      fetchNextPage: vi.fn(),
      historyList: [{ videoId: 'video-1' }],
    })
    vi.mocked(hookMocks.useInfiniteScroll).mockReturnValue({
      ref: vi.fn(),
    } as never)
    vi.mocked(intersectionMocks.useInView).mockReturnValue({
      inView: true,
      ref: vi.fn(),
    } as never)
    vi.mocked(watchLaterApiMocks.useWatchLaterList).mockReturnValue({
      videoWatchLaterList: [{ id: 'video-1', favoriteId: 'fav-1' }],
    })
  })

  it('wires HistoryWrapper filters, selection, detail mode, and sticky state', () => {
    render(<HistoryWrapper />)

    expect(featureMocks.useHistoryList).toHaveBeenCalledWith({
      from: undefined,
      kw: '',
      time: 'all',
      to: undefined,
      watchAt: 'all',
    })
    expect(getMockProps(screen.getByTestId('HistoryTitle'))).toEqual({ isDetail: false })
    expect(getMockProps(screen.getByTestId('HistoryFilterWrapper'))).toEqual({
      ids: [],
      isDetail: false,
      isSelect: false,
      isSticky: false,
      open: false,
    })

    fireEvent.click(screen.getByRole('button', { name: 'detail on' }))
    expect(getMockProps(screen.getByTestId('HistoryTitle'))).toEqual({ isDetail: true })

    fireEvent.click(screen.getByRole('button', { name: 'set history time' }))
    fireEvent.click(screen.getByRole('button', { name: 'set history watchAt' }))
    fireEvent.click(screen.getByRole('button', { name: 'set history kw' }))
    expect(featureMocks.useHistoryList).toHaveBeenLastCalledWith({
      from: undefined,
      kw: 'Milimili',
      time: '10',
      to: undefined,
      watchAt: 'today',
    })

    fireEvent.click(screen.getByRole('button', { name: 'set history ids' }))
    fireEvent.click(screen.getByRole('button', { name: 'set history select' }))
    fireEvent.click(screen.getByRole('button', { name: 'set history open' }))
    expect(getMockProps(screen.getByTestId('HistoryVideoList'))).toEqual({
      historyList: [{ videoId: 'video-1' }],
      ids: ['history-1'],
      isDetail: true,
      isSelect: true,
      isSticky: true,
    })
  })

  it('wires WatchLaterWrapper filters, selection state, and title total', () => {
    render(<WatchLaterWrapper />)

    expect(watchLaterApiMocks.useWatchLaterList).toHaveBeenCalledWith({
      addAt: 'all',
      from: undefined,
      kw: '',
      sort: 'latest',
      time: 'all',
      to: undefined,
      type: 'all',
    })
    expect(getMockProps(screen.getByTestId('WatchLaterTitle'))).toEqual({
      isDetail: false,
      sort: 'latest',
      total: 1,
    })

    fireEvent.click(screen.getByRole('button', { name: 'watch detail on' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set sort' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set type' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set time' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set addAt' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set kw' }))

    expect(watchLaterApiMocks.useWatchLaterList).toHaveBeenLastCalledWith({
      addAt: 'today',
      from: undefined,
      kw: 'later',
      sort: 'favoriteAt',
      time: '10',
      to: undefined,
      type: 'not_watched',
    })

    fireEvent.click(screen.getByRole('button', { name: 'watch set ids' }))
    fireEvent.click(screen.getByRole('button', { name: 'watch set select' }))
    expect(getMockProps(screen.getByTestId('WatchLaterVideoList'))).toEqual({
      ids: [{ favoriteId: 'fav-1', videoId: 'video-1' }],
      isDetail: true,
      isSelect: true,
      videoWatchLaterList: [{ favoriteId: 'fav-1', id: 'video-1' }],
    })
  })
})
