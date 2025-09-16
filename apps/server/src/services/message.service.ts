import { MessageModel } from '@/models'
import { MessageType } from '@mtobdvlb/shared-types'

type MessageStatisticsItem = {
  type: MessageType
  count: number
}

const allTypes: MessageType[] = ['like', 'whisper', 'at', 'reply', 'system']

export const MessageService = {
  statistics: async (userId: string) => {
    const res = await MessageModel.aggregate<MessageStatisticsItem>([
      {
        $match: {
          userId,
          isRead: false,
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]).exec()
    const statsMap = new Map(res.map(({ type, count }) => [type, count]))
    return allTypes.map((type) => ({
      type,
      count: statsMap.get(type) || 0,
    }))
  },
}
