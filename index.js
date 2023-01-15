#!/usr/bin/env node

import { scrapeProducts } from './amazon_scraper.js'
import { connectToDb } from './db_connection.js'
import { Product } from './product_model.js'

const [, , ...productToSearch] = process.argv

if (productToSearch.length > 1) {
  console.log(
    'If the product name contains spaces, enter the product name in quotes like this "star wars"🤖'
  )
  process.exit(1)
}

if (!productToSearch.length) {
  console.log('Please provide a product to search!!!🤖')
  process.exit(1)
}

const productForURL = productToSearch[0].replaceAll(' ', '+')
const productForURI = productToSearch[0].replaceAll(' ', '_')

const URL = `https://www.amazon.es/s?k=${productForURL}&crid=2M8FD9OZE91ZJ&sprefix=%2Caps%2C92&ref=nb_sb_ss_recent_1_0_recent`
const URI = `mongodb+srv://root:root@cluster0.fvg4s0k.mongodb.net/Amazon_${productForURI}?retryWrites=true&w=majority`

await connectToDb(URI)
scrapeProducts(URL).then(async (products) => {
  console.log(`Fetched ${products.length} products successfully✅`)
  console.log('Saving to database...🤖')

  await Product.insertMany(products)
    .then(() => console.log('Products saved succesfully to database✅'))
    .catch((err) => {
      console.error('Something went wrong when saving products to database❌')
      throw err
    })
})
