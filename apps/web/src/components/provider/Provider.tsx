import React from 'react'
import QueryProvider from '@/components/provider/QueryProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { SocketProvider } from '@/components/provider/SocketProvider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <SocketProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SocketProvider>
    </QueryProvider>
  )
}

export default Provider
