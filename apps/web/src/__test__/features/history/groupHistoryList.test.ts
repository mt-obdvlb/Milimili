import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HistoryGetItem } from '@mtobdvlb/shared-types'
import { groupHistoryList } from '@/features/history/groupHistoryList'

const createHistoryItem = (watchAt: string, videoId: string): HistoryGetItem => ({
  title: `video-${videoId}`,
  thumbnail: '/thumbnail.png',
  time: 120,
  username: 'milimili',
  userId: 'user-1',
  url: `/video/${videoId}`,
  duration: 30,
  isFavorite: false,
  watchAt,
  videoId,
})

describe('groupHistoryList', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns an empty array when historyList is missing', () => {
    expect(groupHistoryList()).toEqual([])
  })

  it('groups history items into stable time buckets', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-30T12:00:00+08:00'))

    const historyList = [
      createHistoryItem('2026-03-30T10:00:00+08:00', 'today'),
      createHistoryItem('2026-03-29T11:00:00+08:00', 'yesterday'),
      createHistoryItem('2026-03-27T11:00:00+08:00', 'week'),
      createHistoryItem('2026-03-15T11:00:00+08:00', 'month'),
      createHistoryItem('2026-02-10T11:00:00+08:00', 'earlier'),
    ]

    expect(groupHistoryList(historyList)).toEqual([
      {
        label: '今天',
        value: [historyList[0]],
      },
      {
        label: '昨天',
        value: [historyList[1]],
      },
      {
        label: '近一周',
        value: [historyList[2]],
      },
      {
        label: '一个月内',
        value: [historyList[3]],
      },
      {
        label: '更早',
        value: [historyList[4]],
      },
    ])
  })
})
