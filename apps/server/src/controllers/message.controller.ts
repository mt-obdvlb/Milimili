import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MessageStatisticsList, Result } from '@mtobdvlb/shared-types'
import { MessageService } from '@/services/message.service'
import { MESSAGE } from '@/constants'

export const notificationStatistics: RequestHandler<
  ParamsDictionary,
  Result<MessageStatisticsList>
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const data = await MessageService.statistics(id)
  return res.status(200).json({
    code: 0,
    data,
  })
}
