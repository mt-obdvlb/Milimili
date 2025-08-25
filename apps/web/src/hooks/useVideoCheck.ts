import { useEffect, useState } from 'react'

export const useVideoCheck = (url: string | null, timeout = 5000) => {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')

  useEffect(() => {
    if (!url) {
      setStatus('invalid')
      return
    }

    let mounted = true
    let timer: NodeJS.Timeout

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'

    const cleanUp = () => {
      video.removeEventListener('error', onError)
      video.removeEventListener('abort', onError)
      video.removeEventListener('loadedmetadata', onLoaded)
      clearTimeout(timer)
    }

    const onError = () => {
      if (!mounted) return
      cleanUp()
      setStatus('invalid')
    }

    const onLoaded = () => {
      if (!mounted) return
      cleanUp()
      setStatus('valid')
    }

    video.addEventListener('error', onError)
    video.addEventListener('abort', onError)
    video.addEventListener('loadedmetadata', onLoaded)

    video.src = url
    video.load()

    timer = setTimeout(() => {
      if (!mounted) return
      cleanUp()
      // 只有在依然是 loading 时才置 invalid
      if (status === 'loading') {
        setStatus('invalid')
      }
    }, timeout)

    return () => {
      mounted = false
      cleanUp()
    }
  }, [url, timeout, status])

  return status
}
