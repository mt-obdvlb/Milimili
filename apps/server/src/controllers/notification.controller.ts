import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { NotificationStatisticsList, Result } from '@mtobdvlb/shared-types'
import { NotificationService } from '@/services/notification.service'
import { MESSAGE } from '@/constants'

export const notificationStatistics: RequestHandler<
  ParamsDictionary,
  Result<NotificationStatisticsList>
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const data = await NotificationService.statistics(id)
  return res.status(200).json({
    code: 0,
    data,
  })
}
