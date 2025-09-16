import { MessageType } from '@/api'

export type MessageStatisticsItem = {
  type: MessageType
  count: number
}

export type MessageStatisticsList = MessageStatisticsItem[]
