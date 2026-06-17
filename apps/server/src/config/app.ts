import { env, isProduction } from './env'

export const getAppConfig = () => ({
  port: env.PORT,
  frontendUrl: env.FRONTEND_URL,
  swaggerServerUrl: env.SWAGGER_SERVER_URL,
  swaggerEnabled: env.SWAGGER_ENABLED ?? !isProduction,
  rateLimitWindowSeconds: env.RATE_LIMIT_WINDOW_SECONDS,
  rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
})
