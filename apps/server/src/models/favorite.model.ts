import { Document, model, Schema } from 'mongoose'
import { FavoriteDB } from '@mtobdvlb/shared-types'

export type IFavorite = FavoriteDB & Document

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'FavoriteFolder',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const FavoriteModel = model<IFavorite>('Favorite', favoriteSchema)
