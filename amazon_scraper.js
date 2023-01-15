import { load } from 'cheerio'

export async function scrapeProducts(url) {
  console.log('Fetching Products...🤖')
  try {
    const response = await fetch(url)
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
