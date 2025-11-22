// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // 通用
    PORT: string
    FRONTEND_URL: string
    // MongoDB
    MONGO_URI: string

    // JWT
    JWT_SECRET: string
    JWT_ACCESS_EXPIRES_IN: string
    JWT_REFRESH_EXPIRES_IN: string

    // Redis
    REDIS_URI: string
    REDIS_HOST: string
    REDIS_PORT: string
    REDIS_PASSWORD: string

    // 邮箱
    EMAIL_USER: string
    EMAIL_PASS: string

    // OSS
    OSS_REGION: string
    OSS_ACCESS_KEY_ID: string
    OSS_ACCESS_KEY_SECRET: string
    OSS_BUCKET: string
  }
}
