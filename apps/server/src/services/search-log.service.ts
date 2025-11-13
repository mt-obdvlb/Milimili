import { SearchLogModel } from '@/models'

type SearchLogItem = {
  keyword: string
  _id: string
}

export const SearchLogService = {
  add: async ({ keyword }: { keyword: string }) => {
    if (!keyword?.trim()) return
    await SearchLogModel.create({ keyword: keyword.trim() })
  },
  getTop10: async () => {
    const res = await SearchLogModel.aggregate<SearchLogItem>([
      {
        $group: {
          _id: '$keyword',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]).exec()
    return res.map((item, index) => ({
      keyword: item._id,
      rank: index + 1,
    }))
  },
  get: async () => {
    return SearchLogModel.aggregate<{
      keyword: string
    }>([
      // 先按 keyword 去重
      {
        $group: {
          _id: '$keyword',
        },
      },
      // 随机取 10 条
      {
        $sample: { size: 10 },
      },
      // 改名字段
      {
        $project: {
          _id: 0,
          keyword: '$_id',
        },
      },
    ]).exec()
  },
}
