'use client'

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useQueryClientInstance } from '@/hooks/useQueryClient'

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useQueryClientInstance()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default Provider
