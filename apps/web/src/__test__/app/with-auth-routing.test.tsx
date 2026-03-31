import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createMockComponent } from '@/__test__/utils/component.mock'

const loadWithAuthLayout = async (userId?: string) => {
  vi.resetModules()
  const getUserHomeInfo = vi.fn().mockResolvedValue({
    userHomeInfo: userId ? { user: { id: userId } } : undefined,
  })
  const redirect = vi.fn()

  vi.doMock('@/features', () => ({
    getUserHomeInfo,
  }))
  vi.doMock('next/navigation', () => ({
    redirect,
  }))

  const mod = await import('@/app/(with-auth)/layout')
  return { Layout: mod.default, redirect }
}

const loadRedirectPage = async (
  importPath:
    | '@/app/(with-auth)/message/page'
    | '@/app/(with-auth)/platform/page'
    | '@/app/(with-auth)/video/page'
    | '@/app/(with-auth)/space/page'
    | '@/app/(with-auth)/space/[userId]/relation/page'
    | '@/app/(with-auth)/space/[userId]/upload/page',
  getUserHomeInfoValue?: { userHomeInfo?: { user: { id?: string } } }
) => {
  vi.resetModules()
  const redirect = vi.fn()
  const getUserHomeInfo = vi.fn().mockResolvedValue(getUserHomeInfoValue ?? {})

  vi.doMock('next/navigation', () => ({
    redirect,
  }))
  vi.doMock('@/features', () => ({
    getUserHomeInfo,
  }))

  const mod = await import(importPath)
  return { Page: mod.default, redirect }
}

const loadSimpleLayout = async (
  importPath:
    | '@/app/(with-auth)/message/layout'
    | '@/app/(with-auth)/message/whisper/layout'
    | '@/app/(with-auth)/platform/layout'
    | '@/app/(with-auth)/space/[userId]/relation/layout'
    | '@/app/(with-auth)/space/[userId]/upload/layout',
  componentModules: Record<string, unknown>
) => {
  vi.resetModules()
  for (const [path, moduleValue] of Object.entries(componentModules)) {
    vi.doMock(path, () => moduleValue)
  }
  return import(importPath)
}

describe('with-auth routing and layouts', () => {
  it('renders children when auth exists and redirects when it does not', async () => {
    const authenticated = await loadWithAuthLayout('user-1')
    render(await authenticated.Layout({ children: <div>auth-child</div> }))
    expect(screen.getByText('auth-child')).toBeInTheDocument()
    expect(authenticated.redirect).not.toHaveBeenCalled()

    const unauthenticated = await loadWithAuthLayout()
    await unauthenticated.Layout({ children: <div>hidden</div> })
    expect(unauthenticated.redirect).toHaveBeenCalledWith('/login')
  })

  it('redirects the message root to the whisper tab', async () => {
    const { Page, redirect } = await loadRedirectPage('@/app/(with-auth)/message/page')
    Page()
    expect(redirect).toHaveBeenCalledWith('/message/whisper')
  })

  it('redirects the platform root to upload', async () => {
    const { Page, redirect } = await loadRedirectPage('@/app/(with-auth)/platform/page')
    Page()
    expect(redirect).toHaveBeenCalledWith('/platform/upload')
  })

  it('redirects the video root back home', async () => {
    const { Page, redirect } = await loadRedirectPage('@/app/(with-auth)/video/page')
    Page()
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('redirects the space root based on current session', async () => {
    const unauthenticated = await loadRedirectPage('@/app/(with-auth)/space/page', {
      userHomeInfo: undefined,
    })
    await unauthenticated.Page()
    expect(unauthenticated.redirect).toHaveBeenCalledWith('/')

    const authenticated = await loadRedirectPage('@/app/(with-auth)/space/page', {
      userHomeInfo: { user: { id: 'user-1' } },
    })
    await authenticated.Page()
    expect(authenticated.redirect).toHaveBeenCalledWith('/space/user-1')
  })

  it('redirects relation and upload roots using resolved params', async () => {
    const relation = await loadRedirectPage('@/app/(with-auth)/space/[userId]/relation/page')
    await relation.Page({ params: Promise.resolve({ userId: 'user-2' }) })
    expect(relation.redirect).toHaveBeenCalledWith('/space/user-2/relation/fans')

    const upload = await loadRedirectPage('@/app/(with-auth)/space/[userId]/upload/page')
    await upload.Page({ params: Promise.resolve({ userId: 'user-3' }) })
    expect(upload.redirect).toHaveBeenCalledWith('/space/user-3/upload/video')
  })

  it('renders the shared message and platform layouts', async () => {
    const HeaderBarTypeTwoWrapper = createMockComponent('HeaderBarTypeTwoWrapper')
    const MessageLayoutWrapper = createMockComponent('MessageLayoutWrapper')
    const messageLayout = await loadSimpleLayout('@/app/(with-auth)/message/layout', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/features/message/components/layout/MessageLayoutWrapper': {
        default: MessageLayoutWrapper,
      },
    })

    render(messageLayout.default({ children: <div>message-child</div> }))
    expect(screen.getByTestId('HeaderBarTypeTwoWrapper')).toBeInTheDocument()
    expect(screen.getByTestId('MessageLayoutWrapper')).toBeInTheDocument()
    expect(screen.getByText('message-child')).toBeInTheDocument()

    const PlatformHeader = createMockComponent('PlatformHeader')
    const PlatformNav = createMockComponent('PlatformNav')
    const platformLayout = await loadSimpleLayout('@/app/(with-auth)/platform/layout', {
      '@/features/platform/components/PlatformHeader': { default: PlatformHeader },
      '@/features/platform/components/PlatformNav': { default: PlatformNav },
    })

    render(platformLayout.default({ children: <div>platform-child</div> }))
    expect(screen.getByTestId('PlatformHeader')).toBeInTheDocument()
    expect(screen.getByTestId('PlatformNav')).toBeInTheDocument()
    expect(screen.getByText('platform-child')).toBeInTheDocument()
  })

  it('renders the whisper/relation/upload nested layouts with children', async () => {
    const MessageCommonHeader = createMockComponent('MessageCommonHeader')
    const MessageWhisperWrapper = createMockComponent('MessageWhisperWrapper')
    const whisperLayout = await loadSimpleLayout('@/app/(with-auth)/message/whisper/layout', {
      '@/features/message/components/common/MessageCommonHeader': {
        default: MessageCommonHeader,
      },
      '@/features/message/components/whisper/MessageWhisperWrapper': {
        default: MessageWhisperWrapper,
      },
    })

    render(whisperLayout.default({ children: <div>whisper-child</div> }))
    expect(screen.getByTestId('MessageCommonHeader')).toBeInTheDocument()
    expect(screen.getByTestId('MessageWhisperWrapper')).toBeInTheDocument()
    expect(screen.getByText('whisper-child')).toBeInTheDocument()

    const SpaceRelationTabs = createMockComponent('SpaceRelationTabs')
    const relationLayout = await loadSimpleLayout(
      '@/app/(with-auth)/space/[userId]/relation/layout',
      {
        '@/features/space/components/SpaceRelationTabs': { default: SpaceRelationTabs },
      }
    )

    const relationRender = render(
      await relationLayout.default({ children: <div>relation-child</div> })
    )
    expect(screen.getByTestId('SpaceRelationTabs')).toBeInTheDocument()
    expect(screen.getByText('relation-child')).toBeInTheDocument()
    relationRender.unmount()

    const SpaceUploadWrapper = createMockComponent('SpaceUploadWrapper')
    const uploadLayout = await loadSimpleLayout('@/app/(with-auth)/space/[userId]/upload/layout', {
      '@/features/space/components/upload/SpaceUploadWrapper': { default: SpaceUploadWrapper },
    })

    render(uploadLayout.default({ children: <div>upload-child</div> }))
    expect(screen.getByTestId('SpaceUploadWrapper')).toBeInTheDocument()
    expect(screen.getByText('upload-child')).toBeInTheDocument()
  })
})
