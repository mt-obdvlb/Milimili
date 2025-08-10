import React from 'react'
import QueryProvider from '@/components/provider/QueryProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  )
}

export default Provider
