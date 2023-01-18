import { model, Schema } from 'mongoose'

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    videoDuration: { type: String, required: true },
    isFamilySafe: { type: Boolean, required: true },
    viewCount: { type: String, required: true },
    category: { type: String, required: true },
    publishDate: { type: String, required: true },
    keywords: { type: [String], required: true },
    author: { type: Schema.Types.ObjectId, required: true },
    isPrivate: { type: Boolean, required: true },
    isLiveContent: { type: Boolean, required: true },
    likes: { type: String, required: true },
    dislikes: { type: String, required: true },
    ageRestricted: { type: Boolean, required: false },
    link: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Video = model('Video', videoSchema)
