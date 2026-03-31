import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce, throttle } from '@/utils'

describe('timing utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-31T12:00:00+08:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces trailing calls by default', () => {
    const fn = vi.fn((value: string) => value)
    const debounced = debounce(fn, 100)

    debounced('first')
    debounced('second')

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')
  })

  it('supports leading debounce execution', () => {
    const fn = vi.fn((value: string) => value)
    const debounced = debounce(fn, 100, {
      leading: true,
      trailing: false,
    })

    const result = debounced('first')
    debounced('second')

    expect(result).toBe('first')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')
  })

  it('throttles calls and optionally runs trailing work', () => {
    const leadingFn = vi.fn((value: string) => value)
    const throttled = throttle(leadingFn, 100)

    expect(throttled('first')).toBe('first')
    expect(throttled('second')).toBeUndefined()
    expect(leadingFn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(throttled('third')).toBe('third')
    expect(leadingFn).toHaveBeenCalledTimes(2)

    const trailingFn = vi.fn((value: string) => value)
    const throttledTrailing = throttle(trailingFn, 100, {
      leading: false,
      trailing: true,
    })

    expect(throttledTrailing('tail')).toBe('tail')
    expect(trailingFn).toHaveBeenCalledTimes(1)
    expect(trailingFn).toHaveBeenCalledWith('tail')
  })
})
