import { Document, model, Schema, Types } from 'mongoose'

type FavoriteDB = {
  userId: Types.ObjectId
  videoId: Types.ObjectId
  folderId: Types.ObjectId
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
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
