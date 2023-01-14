import { model, Schema } from "mongoose"

// Creamos el schema, nuestra entidad producto tendrá un nombre y un precio, los dos serán requeridos y de tipo string.
const productSchema = new Schema({
  name: {type: string, required: true, unique: true},
  price: {type: string, required: true}
},{
  // Eliminamos el valor __v que crea mongodb
  versionKey: false,
  // Mongoose asignrá una fecha a los productos de cuando se han creado o modificado. 
  timestamps: true
})

// Exportamos nuestro modelo creado a partir del schema
export const Product = model('Product', productSchema)
