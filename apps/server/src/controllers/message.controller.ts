import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  MessageListDTO,
  MessageListItem,
  MessageSendWhisperDTO,
  MessageStatisticsList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import { MessageService } from '@/services/message.service'
import { MESSAGE } from '@/constants'

export const messageStatistics: RequestHandler<
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

export const messageSendWhisper: RequestHandler<
  ParamsDictionary,
  Result,
  MessageSendWhisperDTO
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const { toId, content } = req.body
  await MessageService.sendWhisper({ id, toId, content })
  if (!toId || !content)
    return res.status(400).json({
      code: 0,
    })
}

export const messageList: RequestHandler<
  ParamsDictionary,
  Result<PageResult<MessageListItem>>,
  MessageListDTO
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const { total, list } = await MessageService.getList(id, req.body)
  return res.status(200).json({
    code: 0,
    data: {
      total,
      list,
    },
  })
}
