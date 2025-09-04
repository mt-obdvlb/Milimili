'use client'

import * as React from 'react'
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type SearchPaginationProps = {
  page: number
  setPage: (page: number) => void
  total: number
  pageSize?: number
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
