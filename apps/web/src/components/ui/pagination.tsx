import * as React from 'react'
import { MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('my-[50px] block flex items-center justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex items-center justify-start', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />
}

type PaginationButtonProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<typeof Button>

function PaginationButton({ className, isActive, disabled, ...props }: PaginationButtonProps) {
  return (
    <Button
      disabled={disabled}
      data-slot='pagination-button'
      data-active={isActive}
      className={cn(
        'text-text1 bg-bg1_float border-line_regular hover:bg-graph_bg_thick mr-2 h-[34px] min-w-[34px] cursor-pointer rounded-[8px] border p-2 text-sm leading-[1] whitespace-nowrap transition-all duration-200 select-none',
        isActive && 'bg-brand_blue border-brand_blue hover:bg-brand_blue text-white',
        disabled && 'hover:bg-bg1_float cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label='Go to previous page'
      disabled={disabled}
      className={cn(
        'h-[34px] min-w-25 rounded-[8px] px-2 text-sm',
        disabled && 'mr-2 cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      <span className=''>上一页</span>
    </PaginationButton>
  )
}

function PaginationNext({
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label='Go to next page'
      disabled={disabled}
      className={cn(
        'h-[34px] min-w-25 rounded-[8px] px-2 text-sm',
        disabled && 'mr-2 cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      <span className=''>下一页</span>
    </PaginationButton>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('mr-[8px] inline-flex w-[34px] text-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className='size-full' />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
