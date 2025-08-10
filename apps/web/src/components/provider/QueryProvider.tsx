'use client'

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useQueryClientInstance } from '@/hooks/useQueryClient'

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useQueryClientInstance()
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  )
}

export default Provider
