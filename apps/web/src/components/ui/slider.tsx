'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex outline-none  touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full  data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    >
      {/*"bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"*/}

      <SliderPrimitive.Track
        data-slot='slider-track'
        className={cn('bg-[#e7e7e7] rounded-[1.5px] relative  overflow-hidden   h-full w-[2px]')}
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className={cn('bg-brand_blue inset-x-0 absolute ')}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot='slider-thumb'
          key={index}
          className='outline-none size-3 align-middle transition-all duration-200 flex rounded-full bg-brand_blue items-center'
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
