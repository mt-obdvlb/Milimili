import { FollowModel, UserModel, VideoModel } from '@/models'
import { FilterQuery } from 'mongoose'
import {
  SearchGetDTO,
  SearchGetItem,
  SearchGetList,
  SearchUserItem,
  SearchVideoItem,
} from '@mtobdvlb/shared-types'

type VideoAggResult = {
  _id: string
  title: string
  thumbnail: string
  time: number
  publishedAt: Date
  userId: string
  userName?: string
  userAvatar?: string
  url: string
  views: number
  danmakus: number
}

type FollowCountAgg = { _id: string; count: number }
type VideoCountAgg = { _id: string; count: number }

export const SearchService = {
  get: async (params: SearchGetDTO): Promise<SearchGetList> => {
    const { kw, page, type, sort, time, publishedAt, from, to } = params
    const pageSize = type === 'user' ? 22 : 30
    const skip = (page - 1) * pageSize

    const userQuery: FilterQuery<typeof UserModel> = {
      name: {
        $regex: kw,
        $options: 'i',
      },
    }
    const videoQuery: FilterQuery<typeof VideoModel> = {
      title: {
        $regex: kw,
        $options: 'i',
      },
    }

    if (time !== 'all') {
      if (time === '10') videoQuery.time = { $lt: 600 }
      if (time === '10to30')
        videoQuery.time = {
          $gte: 600,
          $lt: 1800,
        }
      if (time === '30to60')
        videoQuery.time = {
          $gte: 1800,
          $lt: 3600,
        }
      if (time === '60') videoQuery.time = { $gte: 3600 }
    }

    const now = new Date()
    if (publishedAt !== 'all') {
      let start: Date | null = null
      if (publishedAt === 'today')
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      if (publishedAt === 'week') start = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      if (publishedAt === 'halfYear') start = new Date(now.getTime() - 183 * 24 * 3600 * 1000)
      if (publishedAt === 'customer' && from) start = from
      if (start) {
        videoQuery.publishedAt = { $gte: start }
        if (to) videoQuery.publishedAt.$lte = to
      }
    }

    const sortStage: Record<SearchGetDTO['sort'], Record<string, 1 | -1>> = {
      all: { publishedAt: -1 },
      publishedAt: { publishedAt: -1 },
      view: { 'stats.views': -1 },
      danmaku: { 'stats.danmakus': -1 },
      favorite: { 'stats.favorite': -1 },
    }

    // ===== 视频聚合 =====
    const videoAgg = await VideoModel.aggregate<VideoAggResult>([
      { $match: videoQuery },
      {
        $lookup: {
          from: 'videostats',
          localField: '_id',
          foreignField: 'videoId',
          as: 'stats',
        },
      },
      {
        $unwind: {
          path: '$stats',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      }, // 保证 user 是对象
      { $sort: sortStage[sort] },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          time: 1,
          publishedAt: 1,
          url: 1,
          userId: 1,
          userName: '$user.name',
          userAvatar: '$user.avatar',
          views: '$stats.views',
          danmakus: '$stats.danmakus',
        },
      },
    ])

    const totalVideosAgg = await VideoModel.aggregate<{
      count: number
    }>([{ $match: videoQuery }, { $count: 'count' }])
    const totalVideos = totalVideosAgg[0]?.count ?? 0

    const users = await UserModel.find(userQuery).skip(skip).limit(pageSize).lean()
    const totalUsers = await UserModel.countDocuments(userQuery)

    const userIds = [
      ...new Set([
        ...videoAgg.map((v) => v.userId.toString()),
        ...users.map((u) => u._id.toString()),
      ]),
    ]

    const followCounts = await FollowModel.aggregate<FollowCountAgg>([
      { $match: { followingId: { $in: userIds } } },
      {
        $group: {
          _id: '$followingId',
          count: { $sum: 1 },
        },
      },
    ])
    const followerMap = new Map(followCounts.map((f) => [f._id, f.count]))

    const videoCounts = await VideoModel.aggregate<VideoCountAgg>([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ])
    const videoCountMap = new Map(videoCounts.map((v) => [v._id, v.count]))

    // ===== 构造 SearchGetItem =====

    const items: SearchGetItem[] = []

    if (type === 'user') {
      // 用户类型，只返回用户信息
      items.push(
        ...users.map<SearchGetItem>((u) => ({
          user: {
            id: u._id.toString(),
            name: u.name,
            avatar: u.avatar,
            videos: videoCountMap.get(u._id.toString()) ?? 0,
            followers: followerMap.get(u._id.toString()) ?? 0,
          },
        }))
      )
    } else {
      // all 或 video 类型，返回视频和用户信息
      items.push(
        ...videoAgg.map<SearchGetItem>((v) => ({
          video: {
            id: v._id.toString(),
            title: v.title,
            thumbnail: v.thumbnail,
            danmakus: v.danmakus ?? 0,
            views: v.views ?? 0,
            time: v.time,
            publishedAt: v.publishedAt.toISOString(),
            url: v.url,
          },
          user: {
            id: v.userId.toString(),
            name: v.userName ?? '',
            avatar: v.userAvatar ?? '',
            videos: videoCountMap.get(v.userId.toString()) ?? 0,
            followers: followerMap.get(v.userId.toString()) ?? 0,
          },
        }))
      )
    }

    // ===== 推荐用户（随机有视频的用户） =====
    let recommendUser:
      | {
          user: SearchUserItem
          video: SearchVideoItem[]
        }
      | undefined

    const allUserIdsWithVideos = await VideoModel.distinct('userId')
    if (type === 'all' && page === 1) {
      const [randUser] = await UserModel.aggregate<{
        _id: string
        name: string
        avatar: string
      }>([
        {
          $match: {
            _id: {
              $in: allUserIdsWithVideos,
            },
          },
        },
        { $sample: { size: 1 } },
      ])

      if (randUser) {
        const randVideos = await VideoModel.aggregate<{
          _id: string
          title: string
          thumbnail: string
          time: number
          publishedAt: Date
          url: string
          views: number
          danmakus: number
        }>([
          { $match: { userId: randUser._id } },
          {
            $lookup: {
              from: 'videostats',
              localField: '_id',
              foreignField: 'videoId',
              as: 'stats',
            },
          },
          {
            $unwind: {
              path: '$stats',
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { publishedAt: -1 } },
          { $limit: 6 },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              time: 1,
              publishedAt: 1,
              url: 1,
              views: '$stats.views',
              danmakus: '$stats.danmakus',
            },
          },
        ])

        recommendUser = {
          user: {
            id: randUser._id.toString(),
            name: randUser.name,
            avatar: randUser.avatar,
            videos: videoCountMap.get(randUser._id.toString()) ?? 0,
            followers: followerMap.get(randUser._id.toString()) ?? 0,
          },
          video: randVideos.map((v) => ({
            id: v._id.toString(),
            title: v.title,
            thumbnail: v.thumbnail,
            danmakus: v.danmakus ?? 0,
            views: v.views ?? 0,
            time: v.time,
            publishedAt: v.publishedAt.toISOString(),
            url: `/video/${v._id}`,
          })),
        }
      }
    }

    return {
      list: {
        list: items,
        total: type === 'user' ? totalUsers : totalVideos,
      },
      user: recommendUser,
    }
  },
}
