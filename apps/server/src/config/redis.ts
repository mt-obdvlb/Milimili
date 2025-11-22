export const getRedisConfig = () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  uri: process.env.REDIS_URI,
})
