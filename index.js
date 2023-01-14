import { load } from 'cheerio'
import fs from 'node:fs/promises'
import { createUrls } from './create_urls.js'
import { connectToDb } from './db_connection.js'

const urls = createUrls('ramona te queiero', 2)

for (let i = 0; i <= urls.length; i++) {
  const url = urls[i]
}

// const HTML = await fetch(URLS).then((res) => res.text())

// const $ = load(HTML)
