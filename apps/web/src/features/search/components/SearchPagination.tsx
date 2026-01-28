'use client'

import * as React from 'react'

import { MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

type SearchPaginationProps = {
  page: number
  setPage: (page: number) => void
  total: number
  pageSize?: number
}

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('my-[50px]  flex items-center justify-center', className)}
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

const SearchPagination = ({ page, setPage, total, pageSize = 20 }: SearchPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages) return
    setPage(next)
  }

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []

    if (page <= 5) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('ellipsis', totalPages)
    } else if (page >= totalPages - 3) {
      pages.push(1, 'ellipsis')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1, 'ellipsis')
      for (let i = page - 2; i <= page + 2; i++) pages.push(i)
      pages.push('ellipsis', totalPages)
    }

    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page === 1}
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          />
        </PaginationItem>

        {getPageNumbers().map((p, idx) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationButton isActive={p === page} onClick={() => handlePageChange(p)}>
                {p}
              </PaginationButton>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={page === totalPages}
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default SearchPagination
