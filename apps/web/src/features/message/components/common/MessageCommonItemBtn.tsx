import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib'

const MessageCommonItemBtn = ({
  children,
  className,
  onClick,
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('cursor-pointer mr-3.5 text-sm flex items-center', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default MessageCommonItemBtn
