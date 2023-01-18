import { model, Schema } from 'mongoose'

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    channelURL: { type: String, required: true },
    userURL: { type: String, required: true },
    verified: { type: Boolean, required: true },
    suscribers: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Author = model('Author', authorSchema)
