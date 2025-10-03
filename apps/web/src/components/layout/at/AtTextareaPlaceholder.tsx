import { ReactNode } from 'react'
import { cn } from '@/lib'

const AtTextareaPlaceholder = ({
  className,
  children,
  atTextCount,
}: {
  children: ReactNode
  className?: string
  atTextCount: number
}) => {
  if (atTextCount) return null
  return (
    <div className={cn('absolute z-2 pointer-events-none  top-0 left-0 text-text3', className)}>
      {children}
    </div>
  )
}

export default AtTextareaPlaceholder
