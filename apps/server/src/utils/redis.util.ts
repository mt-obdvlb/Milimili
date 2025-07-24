import { redisConfig } from '@/config'
import Redis from 'ioredis'

const redisUtil = new Redis(redisConfig.uri, {
  keyPrefix: 'milimili:',
})

redisUtil.on('error', (err) => {
  console.error('Redis error:', err)
})

redisUtil.on('connect', () => {
  console.log('Redis connected')
})

export default redisUtil
