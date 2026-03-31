import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useModel } from '@/hooks/useModel'
import { useUiStore } from '@/stores/ui'

describe('store-backed hooks', () => {
  beforeEach(() => {
    useUiStore.setState({
      loginModel: false,
      setLoginModel: (value) => useUiStore.setState({ loginModel: value }),
    })
  })

  it('opens and closes the login modal through the ui store', () => {
    const { result } = renderHook(() => useModel())

    act(() => {
      result.current.openLoginModel()
    })

    expect(useUiStore.getState().loginModel).toBe(true)

    act(() => {
      result.current.closeLoginModel()
    })

    expect(useUiStore.getState().loginModel).toBe(false)
  })
})
