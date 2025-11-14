'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

type CoverImageProps = Omit<ImageProps, 'src'> & {
  src: string
  maxRetry?: number
  fallbackSrc?: string
  showSkeleton?: boolean
}

const CoverImage = ({
  src,
  maxRetry = 2,
  fallbackSrc = '/gochat.png',
  showSkeleton = true,
  ...rest
}: CoverImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [retryCount, setRetryCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    if (retryCount < maxRetry) {
      setRetryCount((c) => c + 1)
      // 更换 src 才能强制 <Image> 重新加载
      setImgSrc(`${src}?retry=${retryCount}`)
    } else {
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <>
      {/* Skeleton */}
      {showSkeleton && !isLoaded && (
        <div className='absolute inset-0 animate-pulse bg-muted rounded-md' />
      )}

      <Image {...rest} src={imgSrc} onLoad={() => setIsLoaded(true)} onError={handleError} />
    </>
  )
}

export default CoverImage
