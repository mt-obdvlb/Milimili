import { ReactNode } from 'react'
import { HoverCardContent } from '@/components'
import { cn } from '@/lib'

const VideoPlayerControllerHoverContent = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <HoverCardContent
      side={'top'}
      sideOffset={20}
      className={cn(
        'text-sm leading-[22px]  text-[hsla(0,0%,100%,.8)] hover:text-white   bg-[hsla(0,0%,8%,.9)] rounded-[2px] border-none  text-center z-9999',
        className
      )}
    >
      {children}
    </HoverCardContent>
  )
}

export default VideoPlayerControllerHoverContent
