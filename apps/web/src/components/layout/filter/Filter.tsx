import { Button } from '@/components'
import { cn } from '@/lib'
import React, { Dispatch, SetStateAction } from 'react'

interface SearchConditionItem<T> {
  label: string
  value: T
}

interface SearchConditionRowProps<T> {
  value: T
  set: Dispatch<SetStateAction<T>>
  list: readonly SearchConditionItem<T>[]
  children?: React.ReactNode
  mt?: boolean
  className?: string
  contanierClassName?: string
}

const Filter = <T extends string | number>({
  value,
  set,
  list,
  children,
  mt,
  className,
  contanierClassName,
}: SearchConditionRowProps<T>) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-start', contanierClassName)}>
      {list.map((item) => (
        <Button
          key={item.value}
          onClick={() => set(item.value)}
          className={cn(
            'text-text2 hover:text-brand_blue bg-bg1 mr-2.5 inline-flex h-8 min-w-[100px] cursor-pointer items-center justify-center rounded-[8px] border-none px-[15px] text-sm leading-[1] whitespace-nowrap transition-all duration-200 select-none',
            value === item.value && 'text-brand_blue bg-brand_blue_thin',
            mt && 'mt-2.5',
            className
          )}
        >
          {item.label}
        </Button>
      ))}
      {children}
    </div>
  )
}

export default Filter
