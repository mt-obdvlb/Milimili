import { Document, model, Schema } from 'mongoose'
import { FavoriteFolderDB } from '@mtobdvlb/shared-types'

export type IFavoriteFolder = FavoriteFolderDB & Document

const favoriteFolderSchema = new Schema<IFavoriteFolder>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    type: {
      type: String,
      enum: ['default', 'watch_later', 'normal'],
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
