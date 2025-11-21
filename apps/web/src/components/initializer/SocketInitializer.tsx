'use client'

import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { useUserStore } from '@/stores'
import { useQueryClient } from '@tanstack/react-query'

export const SocketInitializer = () => {
  const user = useUserStore((state) => state.user)
  useEffect(() => {
    if (!user) return
    const socket = getSocket()
    if (socket.connected) return

    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Socket connected', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [user])

  const socket = getSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return
    socket.on('new_notification', async () => {
      await queryClient.invalidateQueries({ queryKey: ['message', 'statistics'] })
    })
    socket.on('new_history', async () => {
      await queryClient.invalidateQueries({ queryKey: ['history', 'recent'] })
    })
    socket.on('new_favorite', async () => {
      await queryClient.invalidateQueries({ queryKey: ['favorite', 'recent'] })
    })
    socket.on('new_feed', async () => {
      await queryClient.invalidateQueries({ queryKey: ['feed', 'recent'] })
    })
    socket.on('new_whisper', async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversation'] })
    })
    return () => {
      socket.off('new_notification')
      socket.off('new_history')
      socket.off('new_favorite')
      socket.off('new_feed')
    }
  }, [socket, queryClient])

  return null
}
