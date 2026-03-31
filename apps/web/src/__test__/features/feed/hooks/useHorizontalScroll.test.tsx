import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHorizontalScroll } from '@/features/feed/hooks/useHorizontalScroll'

class ResizeObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(public callback: ResizeObserverCallback) {}
}

const createContainer = (clientWidth: number) => {
  const container = document.createElement('div')
  Object.defineProperty(container, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  })
  return container
}

describe('useHorizontalScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('disables both buttons when content does not overflow', async () => {
    const containerRef = {
      current: createContainer(200),
    }

    const { result } = renderHook(() => useHorizontalScroll(containerRef, 2, 80))

    await waitFor(() => {
      expect(result.current.canScrollLeft).toBe(false)
      expect(result.current.canScrollRight).toBe(false)
    })
  })

  it('moves right and clamps the translate value within bounds', async () => {
    const onIndexChange = vi.fn()
    const containerRef = {
      current: createContainer(200),
    }

    const { result } = renderHook(() => useHorizontalScroll(containerRef, 10, 50, onIndexChange))

    await waitFor(() => {
      expect(result.current.canScrollRight).toBe(true)
    })

    act(() => {
      result.current.moveRight()
    })

    expect(result.current.translateX).toBe(-100)
    expect(onIndexChange).toHaveBeenLastCalledWith(-100)
  })

  it('scrolls a hidden item into view', async () => {
    const containerRef = {
      current: createContainer(200),
    }

    const { result } = renderHook(() => useHorizontalScroll(containerRef, 10, 50))

    await waitFor(() => {
      expect(result.current.canScrollRight).toBe(true)
    })

    act(() => {
      result.current.scrollToIndex(7)
    })

    expect(result.current.translateX).toBe(-200)
  })
})
