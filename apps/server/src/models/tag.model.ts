import { Document, model, Schema } from 'mongoose'
import { TagDB } from '@mtobdvlb/shared-types'

export type ITag = TagDB & Document

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Video',
    },
  },
  { versionKey: false, timestamps: true }
)

export const TagModel = model<ITag>('Tag', tagSchema)
