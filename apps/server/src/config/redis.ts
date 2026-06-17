import { env } from './env'

export const getRedisConfig = () => ({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  uri: env.REDIS_URI,
})
