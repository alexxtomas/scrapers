import mongoose from 'mongoose'

// Pega tu URI de conexión a MongoDB aquí
const URI =
  'mongodb+srv://root:root@cluster0.fvg4s0k.mongodb.net/star-wars?retryWrites=true&w=majority'

// Nos conectamos a la base de datos
export async function connectToDb() {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true }).set('strictQuery', false)
    console.log('Connected to the DB 👀')
  } catch (error) {
    console.error('Failed to connect to the DB 💔', error)
  }
}
