#!/usr/bin/env node
/* eslint-disable camelcase */
import puppeteer from 'puppeteer'
import ytdl from 'ytdl-core'
import { connectToDb } from './db_connection.js'
import { Author } from './models/author_model.js'
import { Video } from './models/video_model.js'

const PREFIX = 'Youtube Scraper 🤖 - '

export async function scrape() {
  const searchValue = 'really short videos'

  const URI = `mongodb+srv://root:root@cluster0.xmqbgxh.mongodb.net/${searchValue.replaceAll(
    ' ',
    '_'
  )}?retryWrites=true&w=majority`

  console.log(PREFIX, 'Configuring the browser')
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  // Abrir una nueva pestaña
  console.log(PREFIX, 'Opening the browser')
  const page = await browser.newPage()

  // Ir a la URL
  console.log(PREFIX, 'Going to youtube')
  await page.goto('https://www.youtube.com')

  console.log(PREFIX, 'Accepting youtube cookies')
  const acceptAllButton = await page.waitForSelector(
    'button[aria-label="Accept the use of cookies and other data for the purposes described"]'
  )
  await acceptAllButton.click()

  await page.waitForNavigation()
  console.log(PREFIX, 'Typing in the serach bar')
  const searchInput = await page.$('input#search')

  await searchInput.type(searchValue)

  console.log(PREFIX, 'Clicking on the search button')
  await page.waitForFunction(`document.querySelector('input#search').value === '${searchValue}'`)

  await page.click('button#search-icon-legacy')

  await page.waitForNetworkIdle()

  console.log(PREFIX, 'Selecting the videos')
  const videos = await page.evaluate(() => {
    const videoElements = document.querySelectorAll('.ytd-video-renderer #video-title')
    const videos = []
    videoElements.forEach(({ textContent, href: link }) => {
      const title = textContent.replace(/\n/g, '').trim()
      videos.push({ title, link })
    })
    return videos
  })

  const totalVideos = videos.length
  console.log(PREFIX, `${totalVideos} selected`)
  if (!totalVideos) {
    console.error(PREFIX, 'Something went wrong, please try again❌')
    process.exit(1)
  }

  console.log(PREFIX, 'Formatting all the videos. This may take a while, please wait.')

  const authors = []

  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    const { videoDetails } = await ytdl.getInfo(link)
    const {
      name,
      user,
      channel_url: channelURL,
      user_url: userURL,
      verified,
      subscriber_count: subscribers
    } = videoDetails.author
    authors[i] = {
      name,
      user,
      channelURL,
      userURL,
      verified,
      subscribers: subscribers.toString()
    }
    const {
      description,
      lengthSeconds: videoDuration,
      isFamilySafe,
      viewCount,
      category,
      publishDate,
      keywords,
      isPrivate,
      isLiveContent,
      likes,
      dislikes,
      age_restricted: ageRestricted,
      video_url: videoURL
    } = videoDetails
    videos[i] = {
      author: authors[i],
      video,
      description,
      videoDuration,
      isFamilySafe,
      viewCount,
      category,
      publishDate,
      keywords: keywords ?? [],
      isPrivate,
      isLiveContent,
      likes: likes ?? 'Unknown',
      dislikes: dislikes ?? 'Unknown',
      ageRestricted,
      videoURL
    }
  }
  console.log(PREFIX, 'Videos formatted successfully!')
  console.log(PREFIX, 'Connecting to database...')

  await connectToDb(URI)

  console.log(PREFIX, 'Saving videos to database!. This may taye a while, please wait. ')
  await Promise.all([await Video.insertMany(videos), await Author.insertMany(authors)])
    .then(() => {
      console.log(PREFIX, 'Inserted %d videos and %d authors', videos.length, authors.length)
    })
    .catch((err) => {
      console.error(PREFIX, 'Error while saving data to database ❌')
      throw err
    })
}
scrape()
