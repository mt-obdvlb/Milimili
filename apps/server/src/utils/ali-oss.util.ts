import Oss from 'ali-oss'
import { getOssConfig } from '@/config'

const createOssClient = () => {
  const ossConfig = getOssConfig()

  return new Oss({
    bucket: ossConfig.bucket,
    accessKeyId: ossConfig.accessKeyId,
    accessKeySecret: ossConfig.accessKeySecret,
    region: ossConfig.region,
    secure: true,
  })
}

export const getUploadURL = async (fileName: string) => {
  const ossClient = createOssClient()
  const objectKey = `${Date.now()}-${fileName}`
  const url = ossClient.signatureUrl(objectKey, {
    expires: 300,
    method: 'PUT',
    'Content-Type': 'application/octet-stream',
  })
  return {
    url,
    objectKey,
  }
}
