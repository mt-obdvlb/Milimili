import { Document, model, Schema, Types } from 'mongoose'

type UserBase = {
  email: string
}

type UserDB = UserBase & {
  password?: string
  _id: Types.ObjectId
  name: string
  avatar: string
}
export type IUser = UserDB & Document

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
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
      required: true,
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
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
)

export const UserModel = model('User', userSchema)
