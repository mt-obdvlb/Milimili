import { afterEach, describe, expect, it } from 'vitest'
import { getClearCookieOptions, getCookieOptions } from '../../utils/cookie.util.js'

describe('cookie util', () => {
  const originalNodeEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
  })

  it('uses strict and secure cookies in production', async () => {
    process.env.NODE_ENV = 'production'

    expect(getCookieOptions(1000)).toMatchObject({
      httpOnly: true,
      maxAge: 1000,
      path: '/',
      sameSite: 'strict',
      secure: true,
    })
    expect(getClearCookieOptions()).toMatchObject({
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
    })
  })

  it('keeps lax and non-secure cookies outside production', async () => {
    process.env.NODE_ENV = 'development'

    expect(getCookieOptions(1000)).toMatchObject({
      httpOnly: true,
      maxAge: 1000,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })
    expect(getClearCookieOptions()).toMatchObject({
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })
  })
})
