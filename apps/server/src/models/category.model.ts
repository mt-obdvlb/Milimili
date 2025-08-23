import { Document, model, Schema, Types } from 'mongoose'

type CategoryBase = {
  name: string
}

type CategoryDB = CategoryBase & {
  _id: Types.ObjectId
}
export type ICategory = CategoryDB & Document

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const CategoryModel = model<ICategory>('Category', categorySchema)
