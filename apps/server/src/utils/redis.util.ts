import { redisConfig } from '@/config'
import Redis from 'ioredis'

const redis = new Redis(redisConfig.uri, {
  keyPrefix: 'milimili:',
})

redis.on('error', (err) => {
  console.error('Redis error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export default redis
