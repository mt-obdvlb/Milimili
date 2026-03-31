import { expect, test } from '@playwright/test'

const authenticatedCookies = [
  {
    name: 'access_token',
    value: 'mock-access-token',
    url: 'http://127.0.0.1:3001',
  },
  {
    name: 'refresh_token',
    value: 'mock-refresh-token',
    url: 'http://127.0.0.1:3001',
  },
]

test.beforeEach(async ({ context }) => {
  await context.addCookies(authenticatedCookies)
})

test('renders mocked history timeline data', async ({ page }) => {
  await page.goto('/history')

  await expect(page.getByRole('button', { name: '今天' })).toBeVisible()
  await expect(page.getByText('Mock 历史视频')).toBeVisible()
})

test('renders mocked feed data for authenticated users', async ({ page }) => {
  await page.goto('/feed')

  await expect(page.getByText('Mock 测试用户')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Mock 动态作者' })).toBeVisible()
  await expect(page.getByText('Mock 图文动态')).toBeVisible()
})

test('renders mocked video detail data with client-side panels', async ({ page }) => {
  await page.goto('/video/video-1')

  await expect(page.getByText('Mock 视频详情标题')).toBeVisible()
  await expect(page.getByText('接下来播放')).toBeVisible()
  await expect(page.getByText('弹幕列表')).toBeVisible()
})
