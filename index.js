import fs from 'node:fs/promises'
import { connectToDb } from './db_connection.js'

// URL de la página web que queremos scrappear

function createAValidURL(VALUE_TO_SEARCH) {
  const formattedValue = VALUE_TO_SEARCH.replaceAll(' ', '+')
  const URL = `https://www.amazon.es/s?k=${formattedValue}&__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=HO2ZT0SG9A2F&sprefix=${formattedValue}%2Caps%2C119&ref=nb_sb_noss_1`
  return URL
}

const URL = createAValidURL('productos de limpieza')

console.log(URL)
// const VALUE_TO_SEARCH = 'star wars'
// const URL = `https://www.amazon.es/s?k=${VALUE_TO_SEARCH}&__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=HO2ZT0SG9A2F&sprefix=${VALUE_TO_SEARCH}%2Caps%2C119&ref=nb_sb_noss_1`

// Añadimos los productos que queremos scrappear
// const PRODUCTS = 'star wars'

// const pageHTML = await fetch(URL).then((res) => res.text())

// console.log(pageHTML)
