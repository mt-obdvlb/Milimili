import { CookieOptions } from 'express'

const isProduction = () => process.env.NODE_ENV === 'production'

export const getCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  maxAge,
  path: '/',
  sameSite: isProduction() ? 'strict' : 'lax',
  secure: isProduction(),
})

export const getClearCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  path: '/',
  sameSite: isProduction() ? 'strict' : 'lax',
  secure: isProduction(),
})
