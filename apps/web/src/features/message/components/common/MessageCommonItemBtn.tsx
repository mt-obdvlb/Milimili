import { ReactNode } from 'react'
import { cn } from '@/lib'

const MessageCommonItemBtn = ({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={cn('cursor-pointer mr-3.5 text-sm flex items-center', className)} {...props}>
      {children}
    </div>
  )
}

export default MessageCommonItemBtn
