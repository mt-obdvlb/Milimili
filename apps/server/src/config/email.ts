import { env } from './env'

export const getEmailConfig = () => ({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
})
