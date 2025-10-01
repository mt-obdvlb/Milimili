import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('flex items-center text-[13px] text-text1', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul data-slot='pagination-content' className={cn('flex items-center ', className)} {...props} />
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
        'ml-2 inline-flex items-center hover:text-brand_blue',
        isActive && 'text-brand_blue ',
        disabled && 'hidden',
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  disabled,

  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label='Go to previous page' disabled={disabled} {...props}>
      <span className=''>上一页</span>
    </PaginationButton>
  )
}

function PaginationNext({ disabled, ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label='Go to next page' disabled={disabled} {...props}>
      <span className=''>下一页</span>
    </PaginationButton>
  )
}

function PaginationEllipsis({ ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton {...props}>
      <MoreHorizontalIcon className='size-full' />
    </PaginationButton>
  )
}

type CommentPaginationProps = {
  page: number
  setPage: (page: number) => void
  total: number
  pageSize?: number
  setShowReply: Dispatch<SetStateAction<boolean>>
}

const CommentPagination = ({
  total,
  pageSize = 10,
  setPage,
  page,
  setShowReply,
}: CommentPaginationProps) => {
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
      <div className={'mr-2.5'}>{`共${totalPages}页`}</div>
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
      <div>
        <Button onClick={() => setShowReply(false)} className={'ml-2 hover:text-brand_blue '}>
          收起
        </Button>
      </div>
    </Pagination>
  )
}

export default CommentPagination
