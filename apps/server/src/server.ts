import './instrumentation'
import app from './app'
import { getAppConfig, getMongoConfig } from '@/config'
import mongoose, { Types } from 'mongoose'
import { createServer } from 'http'
import { initSocket } from './socket'
import { CategoryModel } from '@/models'

const appConfig = getAppConfig()
const mongoConfig = getMongoConfig()

const PORT = appConfig.port
const MONGO_URI = mongoConfig.uri

const httpServer = createServer(app)

// 初始化 socket
export const io = initSocket(httpServer)

// 默认分类数组
const categories = [
  ['番剧', '电影', '国创', '电视剧', '综艺', '纪录片', '动画', '游戏', '鬼畜', '音乐'],
  ['舞蹈', '影视', '娱乐', '知识', '科技数码', '资讯', '美食', '小剧场', '汽车', '时尚美妆'],
  [
    '体育运动',
    '动物',
    'vlog',
    '绘画',
    '人工智能',
    '家装房产',
    '户外潮流',
    '健身',
    '手工',
    '旅游出行',
  ],
  ['三农', '亲子', '健康', '情感', '生活兴趣', '生活经验', '公益', '超高清'],
  ['专栏', '直播', '活动', '课堂', '社区中心', '新歌热榜'],
]

// 将二维数组拆成一维
const flatCategories = categories.flat().map((name) => ({ _id: new Types.ObjectId(), name }))

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')

    // 初始化默认分类
    const count = await CategoryModel.countDocuments()
    if (count === 0) {
      await CategoryModel.insertMany(flatCategories)
      console.log('✅ 默认分类已初始化')
    }

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
  })
