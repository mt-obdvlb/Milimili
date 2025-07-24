import { errorMiddleware, rateLimiter } from '@/middlewares'
import router from '@/routes'
import { setupSwagger } from '@/utils'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())
app.use(morgan('dev'))
app.use(rateLimiter)

setupSwagger(app)
app.use('/api/v1', router)
app.use(errorMiddleware)

export default app
