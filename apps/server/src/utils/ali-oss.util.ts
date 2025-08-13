import Oss from 'ali-oss'
import { ossConfig } from '@/config/oss'

const ossClient = new Oss({
  bucket: ossConfig.bucket,
  accessKeyId: ossConfig.accessKeyId,
  accessKeySecret: ossConfig.accessKeySecret,
  region: ossConfig.region,
})

export const getUploadURL = async (fileName: string) => {
  const objectKey = `videos/${Date.now()}-${fileName}`
  const url = ossClient.signatureUrl(objectKey, {
    expires: 300,
    method: 'PUT',
  })
  return {
    url,
    objectKey,
  }
}
