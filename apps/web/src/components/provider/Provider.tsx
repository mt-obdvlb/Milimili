import React from 'react'
import QueryProvider from '@/components/provider/QueryProvider'
import { SocketProvider } from '@/components/provider/SocketProvider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  )
}

export default Provider
