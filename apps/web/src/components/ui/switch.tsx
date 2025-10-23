'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer cursor-pointer data-[state=checked]:bg-brand_blue data-[state=unchecked]:bg-graph_bg_thick relative rounded-[10px] w-[30px] h-[20px]  duration-200  transition-all outline-none  disabled:cursor-not-allowed ',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'absolute rounded-full data-[state=unchecked]:left-0.5 data-[state=checked]:left-3 top-0.5  size-4 transition-all duration-200 bg-text_white'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
