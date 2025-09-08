import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'transition-[color,box-shadow] outline-none disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
