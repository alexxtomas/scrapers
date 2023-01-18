#!/usr/bin/env node
import fs from 'node:fs'
import puppeteer from 'puppeteer'
import ytdl from 'ytdl-core'

export async function scrape() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  // Abrir una nueva pestaña
  const page = await browser.newPage()

  // Ir a la URL
  await page.goto('https://www.youtube.com')

  const acceptAllButton = await page.waitForSelector(
    'button[aria-label="Accept the use of cookies and other data for the purposes described"]'
  )
  await acceptAllButton.click()

  await page.waitForNavigation()

  const searchValue = 'really short videos'

  const searchInput = await page.$('input#search')

  await searchInput.type(searchValue)

  await page.waitForFunction(`document.querySelector('input#search').value === '${searchValue}'`)

  await page.click('button#search-icon-legacy')

  await page.waitForNetworkIdle()

  const videos = await page.evaluate(() => {
    const videoElements = document.querySelectorAll('.ytd-video-renderer #video-title')
    const videos = []
    videoElements.forEach(({ textContent, href: link }) => {
      const title = textContent.replace(/\n/g, '').trim()
      videos.push({ title, link })
    })
    return videos
  })

  console.log(videos)

  if (!videos.length) {
    console.error('Something went wrong, please try again❌')
    process.exit(1)
  }
  ytdl(videos[0].link, { quality: 'lowest' }).pipe(fs.createWriteStream())

  // for (const link of videoLinks) {
  //   const videoInfo = await ytdl.getInfo(link)
  //   console.log(videoInfo)
  //   // ytdl(link, { quality: 'lowest',  })
  // }
}
scrape()
