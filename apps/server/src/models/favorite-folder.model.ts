import { Document, model, Schema, Types } from 'mongoose'
import { FavoriteFolderType } from '@mtobdvlb/shared-types'

type FavoriteFolderBase = {
  name: string
  description?: string
  type: FavoriteFolderType
  isOpen: boolean
  thumbnail?: string
}

type FavoriteFolderDB = FavoriteFolderBase & {
  userId: Types.ObjectId
  _id: Types.ObjectId
}
export type IFavoriteFolder = FavoriteFolderDB & Document

const favoriteFolderSchema = new Schema<IFavoriteFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, default: '', trim: true },
    type: {
      type: String,
      enum: ['default', 'watch-later', 'normal'],
      required: true,
      default: 'normal',
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
    thumbnail: { type: String, trim: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const FavoriteFolderModel = model<IFavoriteFolder>('FavoriteFolder', favoriteFolderSchema)
