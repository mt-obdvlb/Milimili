import { expect, test } from '@playwright/test'

test('redirects unauthenticated protected routes to login', async ({ page }) => {
  await page.goto('/history')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByText('密码登录')).toBeVisible()
})

test('supports mocked send-code and password login flows', async ({ page }) => {
  await page.goto('/login')

  await page.getByText('邮箱登录').click()
  await page.getByPlaceholder('请输入邮箱').fill('tester@example.com')
  await page.getByText('获取验证码').click()
  await expect(page.getByText('60s后重发')).toBeVisible()

  await page.getByText('密码登录').click()
  await page.getByPlaceholder('请输入账号').fill('tester@example.com')
  await page.getByPlaceholder('请输入密码').fill('super-secret')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText('Mock 首页视频 1')).toBeVisible()
})
