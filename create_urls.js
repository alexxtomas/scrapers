export function createUrls(VALUE_TO_SEARCH, pages = 1) {
  const formattedValue = VALUE_TO_SEARCH.replaceAll(' ', '+')

  const urls = []

  urls.push(
    `https://www.amazon.es/s?k=${formattedValue}&__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=HO2ZT0SG9A2F&sprefix=${formattedValue}%2Caps%2C119&ref=nb_sb_noss_1`
  )
  if (pages > 1) {
    for (let i = 2; i <= pages; i++) {
      urls.push(
        `https://www.amazon.es/s?k=${formattedValue}&page=${i}&__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=HO2ZT0SG9A2F&sprefix=${formattedValue}%2Caps%2C119&ref=nb_sb_noss_1`
      )
    }
  }
  return urls
}
