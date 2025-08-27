'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket } from '@/lib/socket'

interface SocketContextValue {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextValue>({ socket: null })

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const s = getSocket()
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocketContext = () => useContext(SocketContext)
