import app from './app'
import { appConfig } from '@/config'
import { mongoConfig } from '@/config/mongo'
import mongoose from 'mongoose'
import { createServer } from 'http'
import { initSocket } from './socket'

const PORT = appConfig.port
const MONGO_URI = mongoConfig.uri

const httpServer = createServer(app)

// 初始化 socket
export const io = initSocket(httpServer)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
  })
