import { env } from './env'

export const getOssConfig = () => ({
  region: env.OSS_REGION,
  accessKeyId: env.OSS_ACCESS_KEY_ID,
  accessKeySecret: env.OSS_ACCESS_KEY_SECRET,
  bucket: env.OSS_BUCKET,
})
