import { CommentModel, FeedModel, IMessage, MessageModel, UserModel, VideoModel } from '@/models'
import {
  MessageGetConversationList,
  MessageList,
  MessageListDTO,
  MessageListItem,
  MessageSourceType,
  MessageType,
} from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { ConversationModel } from '@/models/conversation.model'
import { MESSAGE } from '@/constants'
import { HttpError } from '@/utils'

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
          userId: new Types.ObjectId(userId),
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
  sendWhisper: async ({ toId, id, content }: { id: string; toId: string; content: string }) => {
    if (id === toId) throw new HttpError(400, MESSAGE.CANNOT_SEND_MESSAGE_TO_YOURSELF)
    const senderId = new Types.ObjectId(id)
    const receiverId = new Types.ObjectId(toId)
    await Promise.all([
      MessageModel.create({
        userId: receiverId,
        fromUserId: senderId,
        type: 'whisper',
        content,
      }),
    ])
    await Promise.all([
      ConversationModel.findOneAndUpdate(
        {
          userId: senderId,
          toUserId: receiverId,
        },
        {
          userId: senderId,
          toUserId: receiverId,
          lastContent: content,
        },
        {
          new: true,
          upsert: true, // 如果不存在就新建
          timestamps: true,
        }
      ),
      ConversationModel.findOneAndUpdate(
        {
          userId: receiverId,
          toUserId: senderId,
        },
        {
          userId: receiverId,
          toUserId: senderId,
          lastContent: content,
        },
        {
          new: true,
          upsert: true, // 如果不存在就新建
          timestamps: true,
        }
      ),
    ])
  },
  getList: async (
    id: string,
    { type, pageSize = 20, page = 1 }: MessageListDTO
  ): Promise<{ list: MessageList; total: number }> => {
    const userObjectId = new Types.ObjectId(id)
    if (type === 'whisper') {
      const total = await ConversationModel.countDocuments({ userId: userObjectId })

      const conversations = await ConversationModel.find({ userId: userObjectId })
        .sort({
          updatedAt: -1,
        })
        .lean()

      const users = await UserModel.find({
        _id: { $in: conversations.map((s) => new Types.ObjectId(s.toUserId)) },
      })
        .select('_id name avatar')
        .lean()

      return {
        total,
        list: conversations.map((c) => {
          const fromUser = users.find((u) => u._id.toString() === c.toUserId.toString())
          if (!fromUser)
            return {
              id: '',
              fromUser: {
                id: '',
                name: '',
                avatar: '',
              },
              type: 'whisper',
              createdAt: c.updatedAt.toISOString(),
            } satisfies MessageListItem
          return {
            id: c._id.toString(),
            fromUser: {
              id: fromUser._id.toString(),
              name: fromUser.name,
              avatar: fromUser.avatar,
            },
            content: c.lastContent,
            type: 'whisper',
            createdAt: c.updatedAt.toISOString(),
          } satisfies MessageListItem
        }) satisfies MessageList,
      }
    }
    const baseQuery: Partial<Pick<IMessage, 'type' | 'userId'>> = {
      userId: userObjectId,
      type: type,
    }

    const total = await MessageModel.countDocuments(baseQuery)

    const messages = await MessageModel.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    // === 准备批量查询 ===
    const sourceIdByType: Record<MessageSourceType, Set<string>> = {
      comment: new Set(),
      video: new Set(),
      feed: new Set(),
    }
    const userIdSet = new Set<string>()

    messages.forEach((m) => {
      const sid = m.sourceId?.toString()
      if (sid) {
        if (m.type !== 'system') {
          if (m.sourceType) sourceIdByType[m.sourceType].add(sid)
        }
      }
      if (m.fromUserId) userIdSet.add(m.fromUserId.toString())
    })

    // === 批量获取 source 内容 ===
    const videoIds = Array.from(sourceIdByType.video).map((s) => new Types.ObjectId(s))
    const commentIds = Array.from(sourceIdByType.comment).map((s) => new Types.ObjectId(s))
    const feedIds = Array.from(sourceIdByType.feed).map((s) => new Types.ObjectId(s))

    const [videos, comments, feeds] = await Promise.all([
      videoIds.length
        ? VideoModel.find({ _id: { $in: videoIds } })
            .select('_id thumbnail title')
            .lean()
        : Promise.resolve([]),
      commentIds.length
        ? CommentModel.find({ _id: { $in: commentIds } })
            .select('_id content')
            .lean()
        : Promise.resolve([]),
      feedIds.length
        ? FeedModel.find({ _id: { $in: feedIds } })
            .select('_id content mediaUrls')
            .lean()
        : Promise.resolve([]),
    ])

    const videoMap = new Map<
      string,
      {
        _id: Types.ObjectId
        thumbnail?: string
        title?: string
      }
    >(videos.map((v) => [v._id.toString(), v]))
    const commentMap = new Map<
      string,
      {
        _id: Types.ObjectId
        content: string
      }
    >(comments.map((c) => [c._id.toString(), c]))
    const feedMap = new Map<
      string,
      {
        _id: Types.ObjectId
        content: string
        mediaUrls?: string[]
      }
    >(feeds.map((f) => [f._id.toString(), f]))

    // === 批量获取用户信息 ===
    const users =
      userIdSet.size > 0
        ? await UserModel.find({
            _id: { $in: Array.from(userIdSet).map((s) => new Types.ObjectId(s)) },
          })
            .select('_id name avatar')
            .lean()
        : []
    const userMap = new Map<
      string,
      {
        _id: Types.ObjectId
        name?: string
        avatar?: string
      }
    >(users.map((u) => [u._id.toString(), u]))

    // === 构造返回列表 ===
    const list: MessageList = []
    for (const m of messages) {
      const msgId = m._id.toString()
      const createdAt = m.createdAt?.toISOString() ?? new Date().toISOString()
      const item: MessageListItem = {
        id: msgId,
        type: m.type as MessageType,
        createdAt,
        fromUser: {
          name: '',
          avatar: '',
          id: '',
        },
      }

      if (m.type === 'system') {
        const [fromName, content] = (m.content ?? '').split(' ')
        item.fromUser.name = fromName ?? ''
        item.content = content ?? ''
        list.push(item)
        continue
      }

      if (m.fromUserId) {
        const fu = m.fromUserId.toString()
        const u = userMap.get(fu)
        item.fromUser = {
          id: fu,
          name: u?.name ?? '',
          avatar: u?.avatar ?? '',
        }
      }
      item.content = m.content

      item.sourceId = m.sourceId?.toString()
      item.sourceType = m.sourceType

      // myContent
      if ((m.type === 'reply' || m.type === 'like') && m.sourceId && m.sourceType) {
        const sid = m.sourceId.toString()
        item.myContent =
          m.sourceType === 'video'
            ? (videoMap.get(sid)?.thumbnail ?? videoMap.get(sid)?.title ?? '[视频已删除]')
            : m.sourceType === 'comment'
              ? (commentMap.get(sid)?.content ?? '[评论已删除]')
              : m.sourceType === 'feed'
                ? (feedMap.get(sid)?.mediaUrls?.[0] ?? feedMap.get(sid)?.content ?? '[动态已删除]')
                : undefined
      }

      list.push(item)
    }

    return { list, total }
  },
  createConversation: async (userId: string, toUserId: string) => {
    const user = await UserModel.findById(toUserId).lean()
    if (!user) throw new HttpError(400, MESSAGE.USER_NOT_FOUND)
    const message = await MessageModel.findOne({
      $or: [
        {
          userId: new Types.ObjectId(userId),
          fromUserId: new Types.ObjectId(toUserId),
          type: 'whisper',
        },
        {
          userId: new Types.ObjectId(toUserId),
          fromUserId: new Types.ObjectId(userId),
          type: 'whisper',
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
    await ConversationModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        toUserId: new Types.ObjectId(toUserId),
      },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          toUserId: new Types.ObjectId(toUserId),
          lastContent: message?.content ?? '',
        },
      },
      {
        upsert: true,
        new: true,
        timestamps: true,
      }
    )
  },
  getConversation: async (
    userId: string,
    toUserId: string
  ): Promise<MessageGetConversationList> => {
    const conversation = await ConversationModel.findOne({ userId, toUserId }).lean()
    if (!conversation) throw new HttpError(400, MESSAGE.CONVERSATION_NOT_FOUND)

    // 确定会话双方
    const uidA = conversation.userId.toString()
    const uidB = conversation.toUserId.toString()

    // 找出双方的消息，按 createdAt 倒序
    const messages = await MessageModel.find({
      type: 'whisper',
      $or: [
        { userId: uidA, fromUserId: uidB },
        { userId: uidB, fromUserId: uidA },
      ],
    })
      .sort({ createdAt: -1 }) // 倒序
      .lean()

    if (messages.length === 0) return []

    // 批量查用户
    const userIds = new Set<string>()
    messages.forEach((m) => {
      if (m.fromUserId) userIds.add(m.fromUserId.toString())
    })

    const users = await UserModel.find({
      _id: { $in: Array.from(userIds).map((s) => new Types.ObjectId(s)) },
    })
      .select('_id name avatar')
      .lean()

    const userMap = new Map(
      users.map((u) => [u._id.toString(), { id: u._id.toString(), name: u.name, avatar: u.avatar }])
    )

    // === 按 5 分钟分组，倒序 ===
    const result: MessageGetConversationList = []
    let currentGroup: MessageGetConversationList[number] | null = null
    const FIVE_MINUTES = 5 * 60 * 1000

    for (const m of messages) {
      const createdAt = m.createdAt ?? new Date()
      const timeStr = createdAt.toISOString()

      // 倒序分组：如果 currentGroup 为 null 或消息比 currentGroup 时间更早，则新建组
      if (
        !currentGroup ||
        new Date(currentGroup.date).getTime() - createdAt.getTime() > FIVE_MINUTES
      ) {
        currentGroup = { date: timeStr, conversations: [] }
        result.push(currentGroup)
      }

      currentGroup.conversations.push({
        id: m._id.toString(),
        content: m.content ?? '',
        user: userMap.get(m.fromUserId?.toString() ?? '') ?? {
          id: '',
          name: 'Unknown',
          avatar: '',
        },
      })
    }

    return result
  },
  deleteConversation: async (userId: string, conversationId: string) => {
    const conversation = await ConversationModel.findById(conversationId).lean()
    if (!conversation) throw new HttpError(400, MESSAGE.CONVERSATION_NOT_FOUND)
    await ConversationModel.deleteOne({
      _id: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
    })
  },
  read: async (userId: string, type: string, toUserId: string) => {
    if (type === 'whisper') {
      await MessageModel.updateMany(
        {
          userId: new Types.ObjectId(userId),
          type: 'whisper',
          fromUserId: new Types.ObjectId(toUserId),
        },
        {
          isRead: true,
        }
      )
    } else {
      await MessageModel.updateMany(
        {
          userId: new Types.ObjectId(userId),
          type,
        },
        {
          isRead: true,
        }
      )
    }
  },
  atMessage: async (
    userId: string,
    type: MessageSourceType,
    id: Types.ObjectId,
    content?: string
  ) => {
    if (!content) return
    const mentions = content.match(/@([\w\u4e00-\u9fa5_-]+)/g)
    if (!mentions) return

    // 去重并提取用户名
    const names = Array.from(new Set(mentions.map((m) => m.slice(1))))

    // 批量查询用户
    const users = await UserModel.find({ name: { $in: names } }).lean()
    if (!users.length) return

    // 批量创建消息
    const messages = users.map((user) => ({
      type: 'at',
      userId: new Types.ObjectId(user._id),
      sourceType: type,
      fromUserId: new Types.ObjectId(userId),
      sourceId: id,
      content,
    }))

    await MessageModel.insertMany(messages)
  },
  delete: async (userId: string, messageId: string) => {
    await MessageModel.deleteOne({
      _id: new Types.ObjectId(messageId),
      userId: new Types.ObjectId(userId),
    })
  },
}
