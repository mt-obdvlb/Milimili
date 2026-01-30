import { ReactNode } from 'react'
import { HoverCardPureContent } from '@/components'
import { cn } from '@/lib'

const VideoPlayerControllerHoverContent = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <HoverCardPureContent
      className={cn(
        'text-sm leading-[22px] absolute bottom-[45px] left-1/2 -translate-x-1/2 text-[hsla(0,0%,100%,.8)] hover:text-white   bg-[hsla(0,0%,8%,.9)] rounded-[2px] border-none  text-center z-9999',
        className
      )}
    >
      {children}
    </HoverCardPureContent>
  )
}

export default VideoPlayerControllerHoverContent
