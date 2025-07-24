import app from './app'
import { appConfig } from '@/config'
import { mongoConfig } from '@/config/mongo'
import mongoose from 'mongoose'

const PORT = appConfig.port
const MONGO_URI = mongoConfig.uri

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
