import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCanScroll } from '@/hooks/useCanScroll'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useShow } from '@/hooks/useShow'

const { useInViewMock, useScrollMock, useWindowScrollMock } = vi.hoisted(() => ({
  useInViewMock: vi.fn(),
  useScrollMock: vi.fn(),
  useWindowScrollMock: vi.fn(),
}))

vi.mock('react-use', () => ({
  useScroll: useScrollMock,
  useWindowScroll: useWindowScrollMock,
}))

vi.mock('react-intersection-observer', () => ({
  useInView: useInViewMock,
}))

describe('view hooks', () => {
  beforeEach(() => {
    useScrollMock.mockReturnValue({ x: 0 })
    useWindowScrollMock.mockReturnValue({ y: 0 })
    useInViewMock.mockReturnValue({
      inView: false,
      ref: vi.fn(),
    })
  })

  afterEach(() => {
    useScrollMock.mockReset()
    useWindowScrollMock.mockReset()
    useInViewMock.mockReset()
  })

  it('computes whether a horizontal container can scroll', () => {
    useScrollMock.mockReturnValue({ x: 40 })
    const ref = {
      current: {
        clientWidth: 200,
        scrollWidth: 320,
      },
    }

    const { result } = renderHook(() => useCanScroll(ref))

    expect(result.current.canScrollLeft).toBe(true)
    expect(result.current.canScrollRight).toBe(true)
  })

  it('shows content only after the scroll threshold', () => {
    useWindowScrollMock.mockReturnValue({ y: 620 })

    const { result } = renderHook(() => useShow(500))

    expect(result.current.isShow).toBe(true)
  })

  it('triggers the infinite-scroll callback when the sentinel is visible', () => {
    const callback = vi.fn()
    const refSpy = vi.fn()
    useInViewMock.mockReturnValue({
      inView: true,
      ref: refSpy,
    })

    const { result } = renderHook(() => useInfiniteScroll(callback))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(result.current.ref).toBe(refSpy)
  })
})
