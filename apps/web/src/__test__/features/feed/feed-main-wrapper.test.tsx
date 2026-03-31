import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getMockProps } from '@/__test__/utils/component.mock'

vi.mock('@/features/feed/components/FeedPublishWrapper', () => ({
  default: () => <div data-testid='FeedPublishWrapper' />,
}))

vi.mock('@/features/feed/components/FeedFollowingUserList', () => ({
  default: ({ setUserId, userId }: { setUserId: (value: string) => void; userId: string }) => (
    <div data-props={JSON.stringify({ userId })} data-testid='FeedFollowingUserList'>
      <button onClick={() => setUserId('user-from-list')} type='button'>
        choose user
      </button>
    </div>
  ),
}))

vi.mock('@/features/feed/components/FeedTabs', () => ({
  default: ({
    setType,
    type,
  }: {
    setType: (value: 'all' | 'video' | 'image-text') => void
    type: string
  }) => (
    <div data-props={JSON.stringify({ type })} data-testid='FeedTabs'>
      <button onClick={() => setType('video')} type='button'>
        set video
      </button>
      <button onClick={() => setType('image-text')} type='button'>
        set image-text
      </button>
    </div>
  ),
}))

vi.mock('@/features/feed/components/FeedList', () => ({
  default: ({ type, userId }: { type: string; userId: string }) => (
    <div data-props={JSON.stringify({ type, userId })} data-testid='FeedList' />
  ),
}))

import FeedMainWrapper from '@/features/feed/components/FeedMainWrapper'

describe('FeedMainWrapper', () => {
  it('wires feed publish, selected user, and current tab type together', () => {
    render(<FeedMainWrapper />)

    expect(screen.getByTestId('FeedPublishWrapper')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('FeedTabs'))).toEqual({ type: 'all' })
    expect(getMockProps(screen.getByTestId('FeedFollowingUserList'))).toEqual({ userId: '' })
    expect(getMockProps(screen.getByTestId('FeedList'))).toEqual({
      type: 'all',
      userId: '',
    })

    fireEvent.click(screen.getByRole('button', { name: 'choose user' }))
    expect(getMockProps(screen.getByTestId('FeedFollowingUserList'))).toEqual({
      userId: 'user-from-list',
    })
    expect(getMockProps(screen.getByTestId('FeedList'))).toEqual({
      type: 'all',
      userId: 'user-from-list',
    })

    fireEvent.click(screen.getByRole('button', { name: 'set video' }))
    expect(getMockProps(screen.getByTestId('FeedTabs'))).toEqual({ type: 'video' })
    expect(getMockProps(screen.getByTestId('FeedList'))).toEqual({
      type: 'video',
      userId: 'user-from-list',
    })

    fireEvent.click(screen.getByRole('button', { name: 'set image-text' }))
    expect(getMockProps(screen.getByTestId('FeedList'))).toEqual({
      type: 'image-text',
      userId: 'user-from-list',
    })
  })
})
