import { NotificationModel } from '@/models'
import { NotificationType } from '@mtobdvlb/shared-types'

type NotificationStatisticsItem = {
  type: NotificationType
  count: number
}

const allTypes: NotificationType[] = ['like', 'private_message', 'mention', 'reply', 'system']

export const NotificationService = {
  statistics: async (userId: string) => {
    const res = await NotificationModel.aggregate<NotificationStatisticsItem>([
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
