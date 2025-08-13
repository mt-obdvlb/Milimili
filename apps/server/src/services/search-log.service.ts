import { SearchLogModel } from '@/models'

type SearchLogItem = {
  keyword: string
  _id: string
}

export const SearchLogService = {
  add: async ({ keyword }: { keyword: string }) => {
    await SearchLogModel.create({ keyword })
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
}
