import React from 'react'
import QueryProvider from '@/components/provider/QueryProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { SocketProvider } from '@/components/provider/SocketProvider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </SocketProvider>
  )
}

export default Provider
