import mongoose from 'mongoose'

// Pega tu URI de conexión a MongoDB aquí
const URI =
  'mongodb+srv://root:root@cluster0.fvg4s0k.mongodb.net/Amazon?retryWrites=true&w=majority'

// Nos conectamos a la base de datos
console.log('Connecting to database...🤖')
await mongoose
  .set('strictQuery', false)
  .connect(URI)
  .then((db) => console.log(`Connected to database -> ${db.connection.name} ✅`))
  .catch((err) => {
    console.error('Failed to connect to database ❌')
    throw err
  })
