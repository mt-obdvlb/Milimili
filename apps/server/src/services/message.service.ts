import { CommentModel, FeedModel, IMessage, MessageModel, UserModel, VideoModel } from '@/models'
import {
  MessageList,
  MessageListDTO,
  MessageListItem,
  MessageSourceType,
  MessageType,
} from '@mtobdvlb/shared-types'
import { Types } from 'mongoose'
import { ConversationModel } from '@/models/conversation.model'

type MessageStatisticsItem = {
  type: MessageType
  count: number
}

const allTypes: MessageType[] = ['like', 'whisper', 'at', 'reply', 'system']

type LikeGroup = {
  total: number
  sampleFromUserIds: string[]
}

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
  sendWhisper: async ({ toId, id, content }: { id: string; toId: string; content: string }) => {
    await MessageModel.create({
      userId: toId,
      fromUserId: id,
      type: 'whisper',
      content,
    })
  },
  getList: async (
    id: string,
    { type, pageSize = 20, page = 1 }: MessageListDTO
  ): Promise<{ list: MessageList; total: number }> => {
    const userObjectId = new Types.ObjectId(id)
    const baseQuery: Partial<Pick<IMessage, 'type' | 'userId'>> = { userId: userObjectId }
    if (type) baseQuery.type = type

    const total = await MessageModel.countDocuments(baseQuery)

    const messages = await MessageModel.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    // === 准备批量查询 ===
    const likeGroups = new Map<string, LikeGroup>()
    const sourceIdByType: Record<MessageSourceType, Set<string>> = {
      comment: new Set(),
      video: new Set(),
      feed: new Set(),
    }
    const userIdSet = new Set<string>()
    const atQueryKeys = new Set<string>()

    messages.forEach((m) => {
      const sid = m.sourceId?.toString()
      if (sid) {
        if (m.type === 'like')
          likeGroups.set(sid, {
            total: 0,
            sampleFromUserIds: [],
          })
        if (m.type === 'reply' || m.type === 'like') {
          if (m.sourceType) sourceIdByType[m.sourceType].add(sid)
        }
        if (m.type !== 'whisper' && m.type !== 'system' && m.sourceType && sid) {
          atQueryKeys.add(`${m.sourceType}:${sid}`)
        }
      }
      if (m.fromUserId) userIdSet.add(m.fromUserId.toString())
    })

    // === 批量处理 like ===
    if (likeGroups.size > 0) {
      const likeSourceIds = Array.from(likeGroups.keys()).map((s) => new Types.ObjectId(s))
      const totals = await MessageModel.aggregate<{
        _id: Types.ObjectId
        total: number
      }>([
        {
          $match: {
            userId: userObjectId,
            type: 'like',
            sourceId: { $in: likeSourceIds },
          },
        },
        {
          $group: {
            _id: '$sourceId',
            total: { $sum: 1 },
          },
        },
      ])
      totals.forEach((t) => {
        likeGroups.get(t._id.toString())!.total = t.total
      })

      const sampleDocs = await MessageModel.find({
        userId: userObjectId,
        type: 'like',
        sourceId: { $in: likeSourceIds },
      })
        .sort({ createdAt: -1 })
        .select('sourceId fromUserId')
        .lean()

      const tmpMap = new Map<string, Set<string>>()
      sampleDocs.forEach((d) => {
        if (!d.sourceId || !d.fromUserId) return
        const sid = d.sourceId.toString()
        if (!tmpMap.has(sid)) tmpMap.set(sid, new Set())
        const set = tmpMap.get(sid)!
        set.add(d.fromUserId.toString())
      })
      tmpMap.forEach((set, sid) => {
        const arr = Array.from(set).slice(0, 2)
        arr.forEach((u) => userIdSet.add(u))
        likeGroups.get(sid)!.sampleFromUserIds = arr
      })
    }

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
            .select('_id content')
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
      }
    >(feeds.map((f) => [f._id.toString(), f]))

    // === 批量获取 At ===

    // === 批量获取用户信息 ===
    const users =
      userIdSet.size > 0
        ? await UserModel.find({
            _id: { $in: Array.from(userIdSet).map((s) => new Types.ObjectId(s)) },
          })
            .select('_id username avatar')
            .lean()
        : []
    const userMap = new Map<
      string,
      {
        _id: Types.ObjectId
        username?: string
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
        total: 0,
      }

      if (m.type === 'system') {
        const [fromName, content] = (m.content ?? '').split(' ')
        item.fromName = fromName ?? ''
        item.content = content ?? ''
        list.push(item)
        continue
      }

      if (m.type === 'whisper') {
        const conv = m.sourceId ? await ConversationModel.findById(m.sourceId).lean() : null
        item.content = conv?.lastContent ?? m.content
        let partnerId: string | undefined
        if (conv) {
          const uidA = conv.userId?.toString()
          const uidB = conv.toUserId?.toString()
          partnerId = uidA === id ? uidB : uidA
          if (partnerId) {
            item.fromUserId = [partnerId]
            const u = userMap.get(partnerId)
            if (u?.avatar) item.avatar = [u.avatar]
          }
        }
        if (m.sourceId)
          item.total = await MessageModel.countDocuments({
            type: 'whisper',
            sourceId: m.sourceId,
            userId: userObjectId,
            isRead: false,
          })
        continue
      }

      if (m.type === 'like') {
        const sid = m.sourceId?.toString()
        if (sid && likeGroups.has(sid)) {
          const lg = likeGroups.get(sid)!
          item.total = lg.total
          item.fromUserId = lg.sampleFromUserIds
          item.avatar = lg.sampleFromUserIds
            .map((u) => userMap.get(u)?.avatar)
            .filter((v): v is string => !!v)
        }
      } else {
        if (m.fromUserId) {
          const fu = m.fromUserId.toString()
          item.fromUserId = [fu]
          const u = userMap.get(fu)
          item.avatar = u?.avatar ? [u.avatar] : undefined
          item.fromName = u?.username
        }
        item.content = m.content
      }

      // myContent
      if ((m.type === 'reply' || m.type === 'like') && m.sourceId && m.sourceType) {
        const sid = m.sourceId.toString()
        if (m.sourceType === 'video')
          item.myContent = videoMap.get(sid)?.thumbnail ?? videoMap.get(sid)?.title
        else if (m.sourceType === 'comment') item.myContent = commentMap.get(sid)?.content
        else if (m.sourceType === 'feed') item.myContent = feedMap.get(sid)?.content
      }

      // ats

      list.push(item)
    }

    return { list, total }
  },
}
