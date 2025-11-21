import * as MP4Box from 'mp4box'

/**
 * 截取视频第一帧的函数
 */
const getVideoFirstFrame = (video: HTMLVideoElement): Promise<string> =>
  new Promise((resolve, reject) => {
    // 设置一个稍后的时间点以确保有画面
    video.currentTime = 0.1
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
      resolve(thumbnail)
    }
    video.onerror = (e) => {
      reject(e)
    }
  })

export const getVideoMeta = (
  file: File | string
): Promise<{
  time: number
  thumbnail: string
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.src = typeof file === 'string' ? file : URL.createObjectURL(file)

    video.onloadedmetadata = async () => {
      const time = video.duration

      // 条件：如果是 File 类型且格式为 MP4，则尝试解析封面
      if (file instanceof File && file.type === 'video/mp4') {
        try {
          const arrayBuffer = await file.arrayBuffer()
          // 增强类型，添加 fileStart 属性以兼容 MP4BoxBuffer
          const buffer = arrayBuffer as ArrayBuffer & { fileStart: number }
          buffer.fileStart = 0

          const mp4boxfile = MP4Box.createFile()
          mp4boxfile.onError = () => {
            // 解析失败 -> 回退第一帧
            return getVideoFirstFrame(video)
              .then((thumb) => resolve({ time, thumbnail: thumb }))
              .catch(reject)
          }
          mp4boxfile.onReady = (info) => {
            try {
              // 尝试找到 metadata track 包含封面数据
              const metaTrack = info.tracks?.find((t) => t.type === 'metadata')
              if (metaTrack && Array.isArray(metaTrack.samples) && metaTrack.samples.length > 0) {
                const sample = metaTrack.samples[0]
                if (sample?.data) {
                  const blob = new Blob([sample.data], { type: 'image/jpeg' })
                  const reader = new FileReader()
                  reader.onload = () => {
                    const coverBase64 = reader.result as string
                    resolve({ time, thumbnail: coverBase64 })
                  }
                  reader.onerror = () => {
                    // 读取失败 -> 回退第一帧
                    getVideoFirstFrame(video)
                      .then((thumb) => resolve({ time, thumbnail: thumb }))
                      .catch(reject)
                  }
                  reader.readAsDataURL(blob)
                  return
                }
              }
              // 如果没有找到封面或样本，回退第一帧
              getVideoFirstFrame(video)
                .then((thumb) => resolve({ time, thumbnail: thumb }))
                .catch(reject)
            } catch {
              // 任意错误 -> 回退第一帧
              getVideoFirstFrame(video)
                .then((thumb) => resolve({ time, thumbnail: thumb }))
                .catch(reject)
            }
          }

          mp4boxfile.appendBuffer(buffer)
          mp4boxfile.flush()
        } catch {
          // File 转 ArrayBuffer 或解析过程中出错，回退第一帧
          getVideoFirstFrame(video)
            .then((thumb) => resolve({ time, thumbnail: thumb }))
            .catch(reject)
        }
      } else {
        // 非 MP4 或 URL 情况，直接使用第一帧
        getVideoFirstFrame(video)
          .then((thumb) => resolve({ time, thumbnail: thumb }))
          .catch(reject)
      }
    }

    video.onerror = (e) => {
      reject(e)
    }
  })
}
