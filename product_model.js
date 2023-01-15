import { model, Schema } from 'mongoose'

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    image: {
      type: String,
      required: true,
      default: 'https://www.odoo.com/web/image/res.users/1072846/image_1024?unique=3f33558'
    },
    link: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    reviews: Number,
    stars: String
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Product = model('Product', productSchema)
