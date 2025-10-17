import { MessageSourceType, MessageType } from '@/api'

export type MessageListItem = {
  id: string
  type: MessageType
  createdAt: string
  sourceId?: string
  sourceType?: MessageSourceType
  content?: string
  myContent?: string
  fromUser: {
    id: string
    name: string
    avatar: string
  }
}

export type MessageList = MessageListItem[]
// 一般先从message中找
// sourceId,sourceType除了system都要
// myContent只有like,reply时用, content除了like都用, myContent要根据sourceId去video的thumbail,comment的content,feed的content
// isLike只有reply用
// total在like时是有多少人赞了我的, 在whisper时是有多少没读信息(根据message的isRead)

//如果type === reply
//如果type === at
//如果type === like
//如果type === system 只用id,type,content,fromName, fromName,content是将message里的content按空格split后的第一个和第二个
//如果type === whisper content是conversation的lastContent
