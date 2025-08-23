import { useEffect, useState } from 'react'

/**
 * 检测视频链接是否有效
 * @param url 视频链接
 * @param timeout 超时时间，默认 1000ms
 */
export const useVideoCheck = (url: string | null, timeout = 1000) => {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')

  useEffect(() => {
    if (!url) {
      setStatus('invalid')
      return
    }

    let mounted = true
    let timer: NodeJS.Timeout

    const checkWithVideoElement = () => {
      const video = document.createElement('video')

      const cleanUp = () => {
        video.removeEventListener('error', onError)
        video.removeEventListener('stalled', onError)
        video.removeEventListener('abort', onError)
        video.removeEventListener('canplay', onCanPlay)
      }

      const onError = () => {
        if (!mounted) return
        cleanUp()
        setStatus('invalid')
      }

      const onCanPlay = () => {
        if (!mounted) return
        cleanUp()
        setStatus('valid')
      }

      video.addEventListener('error', onError)
      video.addEventListener('stalled', onError)
      video.addEventListener('abort', onError)
      video.addEventListener('canplay', onCanPlay)
      video.src = url
      video.load()

      // 超时处理
      timer = setTimeout(() => {
        if (!mounted) return
        cleanUp()
        setStatus('invalid')
      }, timeout)
    }

    checkWithVideoElement()

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [url, timeout])

  return status
}
