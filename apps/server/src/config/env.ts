import { z } from 'zod'

const booleanFromEnv = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (typeof value === 'boolean') return value
    if (typeof value !== 'string') return undefined
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
  })

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    FRONTEND_URL: z.url().default('http://localhost:3001'),
    SWAGGER_SERVER_URL: z.url().default('http://localhost:3000'),
    SWAGGER_ENABLED: booleanFromEnv,
    MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/milimili'),
    JWT_SECRET: z.string().default('development-only-jwt-secret'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    REDIS_URI: z.string().default('redis://127.0.0.1:6379'),
    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    EMAIL_USER: z.string().default(''),
    EMAIL_PASS: z.string().default(''),
    OSS_REGION: z.string().default(''),
    OSS_ACCESS_KEY_ID: z.string().default(''),
    OSS_ACCESS_KEY_SECRET: z.string().default(''),
    OSS_BUCKET: z.string().default(''),
    RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(1000),
    LOG_LEVEL: z.string().default('info'),
    SENTRY_DSN: z.string().default(''),
    SENTRY_ENVIRONMENT: z.string().optional(),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
    OTEL_ENABLED: booleanFromEnv.default(false),
    OTEL_SERVICE_NAME: z.string().default('milimili-server'),
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.url().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return

    const requiredInProduction = [
      'MONGO_URI',
      'JWT_SECRET',
      'REDIS_URI',
      'EMAIL_USER',
      'EMAIL_PASS',
      'OSS_REGION',
      'OSS_ACCESS_KEY_ID',
      'OSS_ACCESS_KEY_SECRET',
      'OSS_BUCKET',
    ] as const

    for (const key of requiredInProduction) {
      if (!env[key]) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} is required in production`,
        })
      }
    }
  })

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ')
  throw new Error(`Invalid server environment: ${details}`)
}

export const env = parsedEnv.data

export const isProduction = env.NODE_ENV === 'production'
