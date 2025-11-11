'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  inlineClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { inlineClassName?: string }) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn('size-full overflow-hidden relative', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn(' transition-all flex-1 size-full duration-300 ease-in-out', inlineClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
