import { scrapeProducts } from './amazon_scraper.js'
import './db_connection.js'
import { Product } from './product_model.js'

// const search = process.argv[2]

const url =
  'https://www.amazon.es/s?k=straps&crid=2M8FD9OZE91ZJ&sprefix=%2Caps%2C92&ref=nb_sb_ss_recent_1_0_recent'

scrapeProducts(url).then(async (products) => {
  console.log(`Fetched ${products.length} products successfully ✅`)
  console.log('Saving to database...🤖')

  await Product.insertMany(products)
    .then(() => console.log('Products saved succesfully to database ✅'))
    .catch((err) => {
      console.error('Something went wrong when saving products to database ❌')
      throw err
    })
})
