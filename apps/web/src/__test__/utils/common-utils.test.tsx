import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fileToBase64,
  fileToBlobUrl,
  formatFeedDate,
  formatMessageDate,
  formatPlayCount,
  formatTime,
  formatWatchAt,
  getRandomIndex,
  isServer,
  openNewTab,
} from '@/utils'

describe('common web utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-31T12:00:00+08:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('formats duration and counters', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(3661)).toBe('01:01:01')
    expect(formatPlayCount(9999)).toBe('9999')
    expect(formatPlayCount(24000)).toBe('2万')
  })

  it('formats watch/feed/message dates against the current clock', () => {
    expect(formatWatchAt('2026-03-31T10:00:00+08:00')).toBe('今天 10:00')
    expect(formatWatchAt('2026-03-30T10:00:00+08:00')).toBe('昨天 10:00')
    expect(formatWatchAt('2026-03-01T10:00:00+08:00')).toBe('2026年3月1日 10:00')

    expect(formatFeedDate('2026-03-31T11:30:00+08:00')).toBe('30分钟前')
    expect(formatFeedDate('2026-03-31T09:00:00+08:00')).toBe('3小时前')
    expect(formatFeedDate('2026-03-28T12:00:00+08:00')).toBe('3天前')
    expect(formatFeedDate('2026-03-01T10:00:00+08:00')).toBe('03-01')

    expect(formatMessageDate('2026-03-31T11:30:00+08:00')).toBe('30分钟前')
  })

  it('derives blob urls and base64 strings from File objects', async () => {
    const file = new File(['hello'], 'demo.txt', { type: 'text/plain' })
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:demo')

    class FileReaderMock {
      result: string | null = null
      onload: null | (() => void) = null
      onerror: null | ((error?: unknown) => void) = null

      readAsDataURL() {
        this.result = 'data:text/plain;base64,aGVsbG8='
        this.onload?.()
      }
    }

    vi.stubGlobal('FileReader', FileReaderMock)

    expect(fileToBlobUrl(file)).toBe('blob:demo')
    expect(createObjectURLSpy).toHaveBeenCalledWith(file)
    await expect(fileToBase64(file)).resolves.toBe('data:text/plain;base64,aGVsbG8=')
  })

  it('uses randomness and browser globals through thin wrappers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.49)
    expect(getRandomIndex(10)).toBe(4)

    const openSpy = vi.fn()
    vi.stubGlobal('open', openSpy)
    openNewTab('https://example.com')
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank')
  })

  it('detects server and client environments', () => {
    const originalWindow = globalThis.window

    vi.stubGlobal('window', undefined)
    expect(isServer()).toBe(true)

    vi.stubGlobal('window', {} as Window & typeof globalThis)
    expect(isServer()).toBe(false)

    if (originalWindow) {
      vi.stubGlobal('window', originalWindow)
    } else {
      vi.unstubAllGlobals()
    }
  })
})
