import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useQueryClientInstance } from '@/hooks/useQueryClient'
import { useRotation } from '@/hooks/useRotation'

describe('basic web hooks', () => {
  it('increments rotation and exposes the transform style', () => {
    const { result } = renderHook(() => useRotation(90))

    expect(result.current.rotation).toBe(0)
    expect(result.current.style.transform).toBe('rotate(0deg)')

    act(() => {
      result.current.rotate()
      result.current.rotate()
    })

    expect(result.current.rotation).toBe(180)
    expect(result.current.style.transform).toBe('rotate(180deg)')
  })

  it('creates a query client instance with the expected defaults', () => {
    const { result } = renderHook(() => useQueryClientInstance())
    const [queryClient] = result.current

    expect(queryClient.getDefaultOptions().queries?.retry).toBe(1)
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false)
  })
})
