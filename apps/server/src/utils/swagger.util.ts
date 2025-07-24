import { Express } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MiliMili API 文档',
    version: '1.0.0',
    description: '使用 Swagger 自动生成的接口文档',
  },
  servers: [{ url: 'http://localhost:3000' }],
}

const options = {
  swaggerDefinition,
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'], // 你的接口注释路径
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
