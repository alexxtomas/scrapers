import { load } from 'cheerio'
import './db_connection.js'
import { Product } from './product_model.js'

const URL =
  'https://www.amazon.es/s?k=straps&crid=2M8FD9OZE91ZJ&sprefix=%2Caps%2C92&ref=nb_sb_ss_recent_1_0_recent'

async function fetchProduct() {
  console.log('Fetching Products...🤖')
  try {
    const response = await fetch(URL)
    const html = await response.text()
    const $ = load(html)

    const products = []

    $(
      'div.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20'
    ).each((_i, el) => {
      const product = $(el)
      const title = product.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
      const image = product.find('img.s-image').attr('src')

      const link = product.find('a.a-link-normal.a-text-normal').attr('href')

      const reviews = product
        .find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small')
        .children('span')
        .last()
        .attr('aria-label')

      const stars = product
        .find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span')
        .attr('aria-label')

      const price = product.find('span.a-price > span.a-offscreen').text()

      const element = {
        title,
        image,
        link: `https://amazon.com${link}`,
        price
      }

      if (reviews) {
        element.reviews = Number(reviews)
      }

      if (stars) {
        element.stars = stars
      }
      products.push(element)
    })
    return products
  } catch (err) {
    console.error('Something went wrong when fetching the data ❌')
    throw err
  }
}

fetchProduct().then(async (products) => {
  console.log(`Fetched ${products.length} products successfully ✅`)
  console.log('Saving to database...🤖')

  await Product.insertMany(products)
    .then(() => console.log('Products saved succesfully to database ✅'))
    .catch((err) => {
      console.error('Something went wrong when saving products to database ❌')
      throw err
    })
})
