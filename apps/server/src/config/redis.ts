export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  uri: process.env.REDIS_URI || 'redis://:68562520@127.0.0.1:6379',
}
