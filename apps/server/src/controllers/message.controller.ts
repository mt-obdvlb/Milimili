import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  MessageCreateConversationDTO,
  MessageDeleteConversationDTO,
  MessageGetConversationDTO,
  MessageGetConversationList,
  MessageListDTO,
  MessageListItem,
  MessageReadDTO,
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
  return res.status(200).json({
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

export const messageRead: RequestHandler<ParamsDictionary, Result, MessageReadDTO> = async (
  req,
  res
) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  await MessageService.read(id, req.body.type, req.params.id as string)
  return res.status(200).json({
    code: 0,
  })
}

export const messageDeleteConversation: RequestHandler<
  ParamsDictionary,
  Result,
  MessageDeleteConversationDTO
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  await MessageService.deleteConversation(id, req.body.conversationId)
  return res.status(200).json({
    code: 0,
  })
}

export const messageGetConversation: RequestHandler<
  ParamsDictionary,
  Result<MessageGetConversationList>,
  MessageGetConversationDTO
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  const data = await MessageService.getConversation(id, req.body.conversationId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const messageCreateConversation: RequestHandler<
  ParamsDictionary,
  Result,
  MessageCreateConversationDTO
> = async (req, res) => {
  const id = req.user?.id
  if (!id)
    return res.status(401).json({
      message: MESSAGE.INVALID_TOKEN,
      code: 1,
    })
  await MessageService.createConversation(id, req.body.userId)
  return res.status(200).json({
    code: 0,
  })
}
