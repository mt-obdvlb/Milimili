import { env } from './env'

export const getJwtConfig = () => ({
  secret: env.JWT_SECRET,
  accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
})
