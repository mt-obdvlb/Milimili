export const getVideoMeta = (
  file: File | string
): Promise<{
  time: number
  thumbnail: string // base64
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous' // URL 情况避免跨域
    video.preload = 'metadata'
    video.src = typeof file === 'string' ? file : URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      const time = video.duration

      // 确保有内容可绘制
      video.currentTime = 0.1
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas context not available')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
        resolve({ time, thumbnail })
      }
    }

    video.onerror = (e) => reject(e)
  })
}
