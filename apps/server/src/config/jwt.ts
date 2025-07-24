export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'milimili_secret',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}
