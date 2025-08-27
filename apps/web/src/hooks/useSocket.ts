'use client'

import { useSocketContext } from '@/components/provider/SocketProvider'

export const useSocket = () => {
  const { socket } = useSocketContext()
  return {
    socket,
  }
}
