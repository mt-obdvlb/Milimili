import nodemailer from 'nodemailer'
import { getEmailConfig } from '@/config'

const emailConfig = getEmailConfig()

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
  port: emailConfig.port,
  secure: emailConfig.secure,
})

export const EmailService = {
  sendVerifyCode: async (email: string, code: string) => {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'MiliMili 邮箱验证码',
      html: `
        <div style='font-family: sans-serif;'>
          <h2>MiliMili 验证码</h2>
          <p>您的验证码是：<b style='color: #ff4d4f;'>${code}</b></p>
          <p>5分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    })
  },
}
