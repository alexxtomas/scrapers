import mongoose from 'mongoose'

// Nos conectamos a la base de datos
export async function connectToDb(URI) {
  console.log('Connecting to database...🤖')
  await mongoose
    .set('strictQuery', false)
    .connect(URI)
    .then(() => console.log('Connected to database ✅'))
    .catch((err) => {
      console.error('Failed to connect to database ❌')
      throw err
    })
}
