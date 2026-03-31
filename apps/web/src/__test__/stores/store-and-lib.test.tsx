import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserStore, initializeUserStore, useUiStore, useUserStore } from '@/stores'
import { cn } from '@/lib/cn'

describe('stores and simple libs', () => {
  beforeEach(() => {
    useUiStore.setState({
      loginModel: false,
      setLoginModel: (value) => useUiStore.setState({ loginModel: value }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('merges classes through cn', () => {
    expect(cn('px-2', false, 'px-4', 'text-sm')).toBe('px-4 text-sm')
  })

  it('stores ui modal state in zustand', () => {
    expect(useUiStore.getState().loginModel).toBe(false)
    useUiStore.getState().setLoginModel(true)
    expect(useUiStore.getState().loginModel).toBe(true)
  })

  it('creates and mutates user stores in both vanilla and hook forms', () => {
    const vanilla = createUserStore()
    vanilla.getState().setUser({ id: 'user-1', username: 'milimili' } as never)
    expect(vanilla.getState().user).toEqual({ id: 'user-1', username: 'milimili' })
    vanilla.getState().logoutUser()
    expect(vanilla.getState().user).toBeNull()

    const windowSpy = vi.stubGlobal('window', {} as Window & typeof globalThis)
    const initialized = initializeUserStore({
      user: { id: 'user-2', username: 'client-user' } as never,
    })
    expect(initialized.getState().user).toEqual({ id: 'user-2', username: 'client-user' })

    const { result } = renderHook(() => useUserStore((state) => state.user))
    expect(result.current).toEqual({ id: 'user-2', username: 'client-user' })

    windowSpy
  })
})
