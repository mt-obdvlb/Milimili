import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createMockComponent, getMockProps } from '@/__test__/utils/component.mock'

const loadAppLayout = async () => {
  vi.resetModules()

  const Footer = createMockComponent('Footer')
  const Provider = createMockComponent('Provider')
  const Initializer = createMockComponent('Initializer')
  const LoginModel = createMockComponent('LoginModel')

  vi.doMock('@/components/layout/footer/Footer', () => ({ default: Footer }))
  vi.doMock('@/components/provider/Provider', () => ({ default: Provider }))
  vi.doMock('@/components/initializer/Initializer', () => ({ default: Initializer }))
  vi.doMock('@/components/layout/models/login-model/LoginModel', () => ({ default: LoginModel }))

  const mod = await import('@/app/layout')

  return {
    Footer,
    Initializer,
    LoginModel,
    Provider,
    Page: mod.default,
  }
}

const loadHomePage = async () => {
  vi.resetModules()

  const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
  const HeaderBanner = createMockComponent('HeaderBanner')
  const HeaderChannel = createMockComponent('HeaderChannel')
  const HomeHeaderChannelFixed = createMockComponent('HomeHeaderChannelFixed')
  const RecommendedSwiper = createMockComponent('RecommendedSwiper')
  const HomeMainVideoList = createMockComponent('HomeMainVideoList')
  const HomeMainRollBtn = createMockComponent('HomeMainRollBtn')
  const HomeLoginTip = createMockComponent('HomeLoginTip')
  const HomePaletteButton = createMockComponent('HomePaletteButton')

  const getCategoryList = vi.fn().mockResolvedValue({
    categoryList: [{ id: 'cate-1', name: '动画' }],
  })
  const getVideoList = vi.fn().mockResolvedValue({
    videoSwiperList: [{ id: 'video-1' }],
  })

  vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
    default: HeaderBarWrapper,
  }))
  vi.doMock('@/components/layout/header/header-banner/HeaderBanner', () => ({
    default: HeaderBanner,
  }))
  vi.doMock('@/components/layout/header/header-channel/HeaderChannel', () => ({
    default: HeaderChannel,
  }))
  vi.doMock('@/features/home/components/header/HomeHeaderChannelFixed', () => ({
    default: HomeHeaderChannelFixed,
  }))
  vi.doMock('@/components/layout/swiper/RecommendedSwiper', () => ({
    default: RecommendedSwiper,
  }))
  vi.doMock('@/features/home/components/main/HomeMainVideoList', () => ({
    default: HomeMainVideoList,
  }))
  vi.doMock('@/features/home/components/main/HomeMainRollBtn', () => ({
    default: HomeMainRollBtn,
  }))
  vi.doMock('@/features/home/components/other/HomeLoginTip', () => ({
    default: HomeLoginTip,
  }))
  vi.doMock('@/features/home/components/other/HomePaletteButton', () => ({
    default: HomePaletteButton,
  }))
  vi.doMock('@/features/category/api', () => ({
    getCategoryList,
  }))
  vi.doMock('@/features/video/api', () => ({
    getVideoList,
  }))

  const mod = await import('@/app/page')
  return { Page: mod.default, getCategoryList, getVideoList }
}

const loadCategoryPage = async () => {
  vi.resetModules()

  const HeaderBanner = createMockComponent('HeaderBanner')
  const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
  const HeaderChannel = createMockComponent('HeaderChannel')
  const CategoryMainVideoList = createMockComponent('CategoryMainVideoList')
  const CoverImage = createMockComponent('CoverImage')

  const getCategoryList = vi.fn().mockResolvedValue({
    categoryList: [{ id: 'cate-1', name: '动画' }],
  })
  const getCategoryName = vi.fn().mockResolvedValue({
    categoryName: '动画',
  })
  const getVideoList = vi.fn().mockResolvedValue({
    videoSwiperList: [{ id: 'video-1' }],
  })

  vi.doMock('@/components/layout/header/header-banner/HeaderBanner', () => ({
    default: HeaderBanner,
  }))
  vi.doMock('@/components/layout/header/header-bar/HeaderBarWrapper', () => ({
    default: HeaderBarWrapper,
  }))
  vi.doMock('@/components/layout/header/header-channel/HeaderChannel', () => ({
    default: HeaderChannel,
  }))
  vi.doMock('@/features/category/components/CateogryMainVideoList', () => ({
    default: CategoryMainVideoList,
  }))
  vi.doMock('@/components/ui/CoverImage', () => ({
    default: CoverImage,
  }))
  vi.doMock('@/features', () => ({
    getCategoryList,
    getCategoryName,
    getVideoList,
  }))

  const mod = await import('@/app/category/[id]/page')
  return { Page: mod.default, getCategoryName }
}

const loadSearchPage = async () => {
  vi.resetModules()

  const HeaderBarTypeTwoWrapper = createMockComponent('HeaderBarTypeTwoWrapper')
  const SearchWrapper = createMockComponent('SearchWrapper')
  const SearchSearchBar = createMockComponent('SearchSearchBar')

  const getSearchLogTop10 = vi.fn().mockResolvedValue({
    searchLogTop10List: ['动画', '番剧'],
  })

  vi.doMock('@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper', () => ({
    default: HeaderBarTypeTwoWrapper,
  }))
  vi.doMock('@/features/search/components/SearchWrapper', () => ({
    default: SearchWrapper,
  }))
  vi.doMock('@/features/search/components/SearchSearchBar', () => ({
    default: SearchSearchBar,
  }))
  vi.doMock('@/features', () => ({
    getSearchLogTop10,
  }))

  const mod = await import('@/app/search/page')
  return { Page: mod.default }
}

const loadLoginPage = async (userId?: string) => {
  vi.resetModules()

  const LoginWrapper = createMockComponent('LoginWrapper')
  const redirect = vi.fn()
  const getUserHomeInfo = vi.fn().mockResolvedValue({
    userHomeInfo: userId ? { user: { id: userId } } : undefined,
  })

  vi.doMock('@/features/login/components/LoginWrapper', () => ({
    default: LoginWrapper,
  }))
  vi.doMock('@/features', () => ({
    getUserHomeInfo,
  }))
  vi.doMock('next/navigation', () => ({
    redirect,
  }))

  const mod = await import('@/app/login/page')
  return { Page: mod.default, redirect }
}

const loadSimplePublicModule = async (
  importPath: '@/app/find-password/page' | '@/app/hot/page' | '@/app/not-found',
  componentModules: Record<string, unknown>
) => {
  vi.resetModules()

  for (const [path, moduleValue] of Object.entries(componentModules)) {
    vi.doMock(path, () => moduleValue as Record<string, unknown>)
  }

  return import(importPath)
}

describe('public app pages', () => {
  it('renders the root app layout shell', async () => {
    const { Page } = await loadAppLayout()

    render(Page({ children: <div>page-child</div> }))

    expect(screen.getByTestId('Provider')).toBeInTheDocument()
    expect(screen.getByTestId('Initializer')).toBeInTheDocument()
    expect(screen.getByTestId('Footer')).toBeInTheDocument()
    expect(screen.getByTestId('LoginModel')).toBeInTheDocument()
    expect(screen.getByText('page-child')).toBeInTheDocument()
  })

  it('renders the home page with fetched category and video data', async () => {
    const { Page } = await loadHomePage()

    render(await Page())

    expect(getMockProps(screen.getByTestId('HeaderChannel'))).toEqual({
      categoryList: [{ id: 'cate-1', name: '动画' }],
    })
    expect(getMockProps(screen.getByTestId('HomeHeaderChannelFixed'))).toEqual({
      categoryList: [{ id: 'cate-1', name: '动画' }],
    })
    expect(getMockProps(screen.getByTestId('RecommendedSwiper'))).toEqual({
      videoSwiperList: [{ id: 'video-1' }],
    })
    expect(screen.getByTestId('HomeMainVideoList')).toBeInTheDocument()
    expect(screen.getByTestId('HomeMainRollBtn')).toBeInTheDocument()
    expect(screen.getByTestId('HomeLoginTip')).toBeInTheDocument()
    expect(screen.getByTestId('HomePaletteButton')).toBeInTheDocument()
  })

  it('renders the category page with resolved params and data', async () => {
    const { Page, getCategoryName } = await loadCategoryPage()

    render(await Page({ params: Promise.resolve({ id: 'cate-1' }) }))

    expect(getCategoryName).toHaveBeenCalledWith('cate-1')
    expect(screen.getByText('动画')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('HeaderChannel'))).toEqual({
      categoryList: [{ id: 'cate-1', name: '动画' }],
      categoryName: '动画',
    })
    expect(getMockProps(screen.getByTestId('CategoryMainVideoList'))).toEqual({
      categoryName: '动画',
      videoSwiperList: [{ id: 'video-1' }],
    })
  })

  it('renders the search page wrapper when kw exists', async () => {
    const { Page } = await loadSearchPage()

    render(await Page({ searchParams: Promise.resolve({ kw: '动画' }) }))

    expect(getMockProps(screen.getByTestId('SearchWrapper'))).toEqual({
      kw: '动画',
      searchLogTop10List: ['动画', '番剧'],
    })
  })

  it('renders the search input state when kw is missing', async () => {
    const { Page } = await loadSearchPage()

    render(await Page({ searchParams: Promise.resolve({ kw: '' }) }))

    expect(screen.getByText('搜索')).toBeInTheDocument()
    expect(getMockProps(screen.getByTestId('SearchSearchBar'))).toEqual({
      className: 'mt-[30px]',
      searchLogTop10List: ['动画', '番剧'],
    })
  })

  it('renders the login page when no session exists', async () => {
    const { Page, redirect } = await loadLoginPage()

    render(await Page())

    expect(redirect).not.toHaveBeenCalled()
    expect(screen.getByTestId('LoginWrapper')).toBeInTheDocument()
  })

  it('redirects away from login when a session exists', async () => {
    const { Page, redirect } = await loadLoginPage('user-1')

    await Page()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('renders the find-password page shell', async () => {
    const HeaderBarTypeTwoWrapper = createMockComponent('HeaderBarTypeTwoWrapper')
    const CoverImage = createMockComponent('CoverImage')
    const FindPasswordContent = createMockComponent('FindPasswordContent')
    const Breadcrumb = createMockComponent('Breadcrumb')
    const BreadcrumbItem = createMockComponent('BreadcrumbItem')
    const BreadcrumbList = createMockComponent('BreadcrumbList')
    const BreadcrumbSeparator = createMockComponent('BreadcrumbSeparator')

    const mod = await loadSimplePublicModule('@/app/find-password/page', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/components/ui/CoverImage': { default: CoverImage },
      '@/features/find-password/components/FindPasswordContent': {
        default: FindPasswordContent,
      },
      '@/components/ui/breadcrumb': {
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbList,
        BreadcrumbSeparator,
      },
    })

    render(mod.default())

    expect(screen.getByTestId('HeaderBarTypeTwoWrapper')).toBeInTheDocument()
    expect(screen.getByTestId('FindPasswordContent')).toBeInTheDocument()
    expect(screen.getByText('登录')).toBeInTheDocument()
    expect(screen.getByText('忘记密码')).toBeInTheDocument()
  })

  it('renders the hot page shell', async () => {
    const HeaderBarWrapper = createMockComponent('HeaderBarWrapper')
    const HeaderBanner = createMockComponent('HeaderBanner')
    const HotTabs = createMockComponent('HotTabs')
    const HotToTopBtn = createMockComponent('HotToTopBtn')

    const mod = await loadSimplePublicModule('@/app/hot/page', {
      '@/components/layout/header/header-bar/HeaderBarWrapper': { default: HeaderBarWrapper },
      '@/components/layout/header/header-banner/HeaderBanner': { default: HeaderBanner },
      '@/features/hot/components/HotTabs': { default: HotTabs },
      '@/features/hot/components/HotToTopBtn': { default: HotToTopBtn },
    })

    render(mod.default())

    expect(screen.getByTestId('HeaderBarWrapper')).toBeInTheDocument()
    expect(screen.getByTestId('HeaderBanner')).toBeInTheDocument()
    expect(screen.getByTestId('HotTabs')).toBeInTheDocument()
    expect(screen.getByTestId('HotToTopBtn')).toBeInTheDocument()
  })

  it('renders the custom not-found page shell', async () => {
    const HeaderBarTypeTwoWrapper = createMockComponent('HeaderBarTypeTwoWrapper')
    const NotFoundErrorPanel = createMockComponent('NotFoundErrorPanel')
    const NotFoundErrorManga = createMockComponent('NotFoundErrorManga')

    const mod = await loadSimplePublicModule('@/app/not-found', {
      '@/components/layout/header/header-bar/HeaderBarTypeTwoWrapper': {
        default: HeaderBarTypeTwoWrapper,
      },
      '@/features/not-found/components/NotFoundErrorPanel': {
        default: NotFoundErrorPanel,
      },
      '@/features/not-found/components/NotFoundErrorManga': {
        default: NotFoundErrorManga,
      },
    })

    render(mod.default())

    expect(screen.getByTestId('HeaderBarTypeTwoWrapper')).toBeInTheDocument()
    expect(screen.getByTestId('NotFoundErrorPanel')).toBeInTheDocument()
    expect(screen.getByTestId('NotFoundErrorManga')).toBeInTheDocument()
  })
})
