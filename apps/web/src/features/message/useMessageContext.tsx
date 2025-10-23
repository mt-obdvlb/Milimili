'use client'

import { createContext, ReactNode, useContext } from 'react'
import { MessageList } from '@mtobdvlb/shared-types'

type MessageContextType = {
  messageList: MessageList
  fetchNextPage: () => void
}

const MessageContext = createContext<MessageContextType | null>(null)

export const useMessageContext = () => {
  const context = useContext(MessageContext)
  if (!context) throw new Error('useMessageContext must be used inside MessageProvider')
  return context
}

export const MessageProvider = ({
  children,
  fetchNextPageAction,
  messageList,
}: {
  children: ReactNode
  messageList: MessageList
  fetchNextPageAction: () => void
}) => {
  return (
    <MessageContext.Provider value={{ messageList, fetchNextPage: fetchNextPageAction }}>
      {children}
    </MessageContext.Provider>
  )
}
