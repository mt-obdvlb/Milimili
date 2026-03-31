import { Express } from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { getAppConfig } from '@/config'

const appConfig = getAppConfig()
const isCompiledRuntime = __filename.endsWith('.js')
const apiFileExtension = isCompiledRuntime ? 'js' : 'ts'
const swaggerApiGlobs = [
  path.join(__dirname, `../routes/**/*.${apiFileExtension}`),
  path.join(__dirname, `../controllers/**/*.${apiFileExtension}`),
]

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MiliMili API 文档',
    version: '1.0.0',
    description: '使用 Swagger 自动生成的接口文档',
  },
  servers: [{ url: appConfig.swaggerServerUrl }],
}

const options = {
  swaggerDefinition,
  apis: swaggerApiGlobs,
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
