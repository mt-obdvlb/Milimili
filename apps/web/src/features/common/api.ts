'use client'

import { useMutation } from '@tanstack/react-query'
import { commonUpload } from '@/services'
import axios from 'axios'
import { useState } from 'react'

const OSS_BUCKET = 'mtobdvlb-web'
const OSS_REGION = 'oss-cn-beijing'

export type UploadResult = {
  fileUrl: string
}

export const useUploadFile = () => {
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      // 1️⃣ 获取上传 URL
      const { data } = await commonUpload({ fileName: file.name })
      if (!data) throw new Error('获取上传地址失败')

      const { url, objectKey } = data

      // 2️⃣ 上传文件并监听进度
      await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setProgress(percent)
          }
        },
      })

      // 3️⃣ 拼接可访问地址
      const fileUrl = `https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com/${objectKey}`
      return { fileUrl }
    },
  })

  return {
    uploadFile: mutation.mutateAsync, // 调用上传
    progress, // 当前上传进度 (0~100)
    isUploading: mutation.isPending, // 上传中状态
    error: mutation.error, // 错误状态
    data: mutation.data, // 上传结果
    reset: mutation.reset, // 重置状态
  }
}
