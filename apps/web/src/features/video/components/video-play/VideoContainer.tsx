'use client'

import { useVideoContext } from '@/features/video/components/video-play/VideoPlayerProvider'
import { CSSProperties, ReactNode, RefObject } from 'react'
import { cn } from '@/lib'

const VideoContainer = ({
  children,
  containerRef,
  className,
  isShowCursor,
  isShow,
  style,
}: {
  children: ReactNode
  containerRef: RefObject<HTMLDivElement | null>
  className?: string
  isShowCursor: boolean
  isShow: boolean
  style?: CSSProperties
}) => {
  const { toggleFullScreen, isWebFull } = useVideoContext()

  const handleDoubleClick = () => {
    toggleFullScreen()
  }

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick} // 双击全屏
      className={cn(
        'flex-1 abp group/container  relative overflow-hidden bg-[#000]',
        !isShowCursor && 'cursor-none',
        isWebFull && 'fixed! inset-0 z-100000',
        isShow && 'fixed! z-100000 rounded-[4px] h-[180px] w-[320px] shadow-[0_0_8px_#e5e9ef]',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

export default VideoContainer
