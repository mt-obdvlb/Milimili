import { UserDB } from '@mtobdvlb/shared-types'
import { Document, model, Schema } from 'mongoose'

export type IUser = UserDB & Document

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: false,
      unique: true,
      minlength: 4,
      maxlength: 20,
      default: () => {
        const now = Date.now().toString()
        const suffix = now.slice(-6)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const randomStr = Array.from(
          { length: 6 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join('')
        return `milimili${suffix}${randomStr}`
      },
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://mtobdvlb-web.oss-cn-beijing.aliyuncs.com/milimili/avatar.jpg',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (val: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(val),
        message: '密码需包含大写字母、小写字母、数字和特殊字符',
      },
    },
  },
  { versionKey: false, timestamps: true }
)

export const UserModel = model('User', userSchema)
