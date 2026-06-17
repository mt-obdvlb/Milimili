import 'dotenv/config'
import { errorMiddleware, rateLimiter, securityHeaders } from '@/middlewares'
import router from '@/routes'
import { setupSwagger } from '@/utils'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { getAppConfig } from '@/config'

const appConfig = getAppConfig()

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(securityHeaders)
app.use(
  cors({
    origin: appConfig.frontendUrl,
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(morgan(appConfig.swaggerEnabled ? 'dev' : 'combined'))
app.use(rateLimiter)

if (appConfig.swaggerEnabled) {
  setupSwagger(app)
}
app.use('/api/v1', router)
app.use(errorMiddleware)

export default app
