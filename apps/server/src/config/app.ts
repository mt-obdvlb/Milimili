export const getAppConfig = () => ({
  port: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000',
})
