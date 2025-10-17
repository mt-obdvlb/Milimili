export type MessageGetConversationItem = {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatar: string
  }
}

export type MessageGetConversationList = {
  conversations: MessageGetConversationItem[]
  date: string
}[]
