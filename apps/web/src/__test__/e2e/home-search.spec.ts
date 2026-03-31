import { expect, test } from '@playwright/test'

test('renders the mocked home page data end to end', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: '番剧' }).first()).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Mock 首页视频 1', exact: true }).first()
  ).toBeVisible()
})

test('renders mocked search results without hitting real services', async ({ page }) => {
  await page.goto('/search?kw=%E7%8C%AB%E7%8C%AB')

  await expect(page.getByRole('tab', { name: '综合' })).toBeVisible()
  await expect(page.getByText('Mock 猫猫 UP')).toBeVisible()
  await expect(page.getByText('Mock 搜索视频 1')).toBeVisible()
})
