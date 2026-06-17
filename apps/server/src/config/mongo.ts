import { env } from './env'

export const getMongoConfig = () => ({
  uri: env.MONGO_URI,
})
