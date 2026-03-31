import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCountdownClose } from '@/hooks/useCountdownClose'
import { useSendCode } from '@/hooks/useSendCode'

const { sendCodeMock, toastMock } = vi.hoisted(() => ({
  sendCodeMock: vi.fn(),
  toastMock: vi.fn(),
}))

vi.mock('@/features/auth/api', () => ({
  useAuthSendCode: () => ({
    sendCode: sendCodeMock,
  }),
}))

vi.mock('@/lib', () => ({
  toast: toastMock,
}))

describe('timer-oriented hooks', () => {
  afterEach(() => {
    vi.useRealTimers()
    sendCodeMock.mockReset()
    toastMock.mockReset()
  })

  it('auto closes and calls onComplete after countdown ends', async () => {
    vi.useFakeTimers()
    let completed = 0

    const { result } = renderHook(() => {
      const [open, setOpen] = useState(true)
      const countdownState = useCountdownClose(open, setOpen, {
        duration: 0.2,
        interval: 0.1,
        onComplete: () => {
          completed += 1
        },
      })

      return {
        open,
        ...countdownState,
      }
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(result.current.open).toBe(false)
    expect(completed).toBe(1)
    expect(result.current.countdown).toBe(0.2)
  })

  it('validates email before sending code', async () => {
    const { result } = renderHook(() => useSendCode())

    await act(async () => {
      await result.current.handleSendCode('invalid-email')
    })

    expect(sendCodeMock).not.toHaveBeenCalled()
    expect(toastMock).toHaveBeenCalledWith('请输入有效邮箱')
  })

  it('starts a 60-second countdown after a successful send', async () => {
    vi.useFakeTimers()
    sendCodeMock.mockResolvedValue({ code: 0 })

    const { result } = renderHook(() => useSendCode())

    await act(async () => {
      await result.current.handleSendCode('user@example.com')
    })

    expect(sendCodeMock).toHaveBeenCalledWith({ email: 'user@example.com' })
    expect(toastMock).toHaveBeenCalledWith('验证码已发送')
    expect(result.current.countdown).toBe(60)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(result.current.countdown).toBe(59)
  })
})
