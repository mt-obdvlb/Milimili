import { cn } from '@/lib'
import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'
import { ReactNode, RefObject } from 'react'
import '@/features/video/video-danmaku-scroll.css'

const VideoDanmakuScrollbar = ({
  children,
  ref,
}: {
  children: ReactNode
  ref: RefObject<OverlayScrollbarsComponentRef | null>
}) => {
  return (
    <OverlayScrollbarsComponent
      className={cn('max-h-[344px] relative')}
      options={{
        scrollbars: {
          autoHide: 'leave',
          theme: 'os-theme-milimili',
          dragScroll: true,
          autoHideDelay: 0,
        },
        overflow: {
          y: 'scroll',
          x: 'hidden',
        },
      }}
      defer
      ref={ref}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}

export default VideoDanmakuScrollbar
