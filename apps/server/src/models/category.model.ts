import { Document, model, Schema } from 'mongoose'
import { CategoryDB } from '@mtobdvlb/shared-types'

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
