import { useMutation } from '@tanstack/react-query'
import { commonUpload } from '@/services'
import axios from 'axios'

const OSS_BUCKET = 'mtobdvlb-web'
const OSS_REGION = 'oss-cn-beijing'

export type UploadResult = {
  fileUrl: string // 上传后可访问的地址
}

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      // 1️⃣ 获取 OSS 上传 URL 和 objectKey
      const { data } = await commonUpload({ fileName: file.name })
      if (!data) {
        throw new Error('获取上传地址失败')
      }
      const { url, objectKey } = data

      // 2️⃣ PUT 上传文件到 OSS
      await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })

      // 3️⃣ 拼接可访问 URL
      const fileUrl = `https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com/${objectKey}`

      return { fileUrl }
    },
  })

  return {
    uploadFile: mutation.mutateAsync, // (file: File) => Promise<UploadResult>
  }
}
