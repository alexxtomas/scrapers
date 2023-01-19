#!/usr/bin/env node
/* eslint-disable camelcase */
import puppeteer from 'puppeteer'
import ytdl from 'ytdl-core'
import { connectToDb } from './logic/db/db_connection.js'
import { saveDataToDb } from './logic/db/save_data_to_db.js'
import { log } from './logic/log.js'
;(async () => {
  const searchValue = 'really short videos'

  const URI = `mongodb+srv://root:root@cluster0.xmqbgxh.mongodb.net/${searchValue.replaceAll(
    ' ',
    '_'
  )}?retryWrites=true&w=majority`

  log({ message: 'Configuring the browser' })

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  // Abrir una nueva pestaña
  log({ message: 'Opening the browser' })
  const page = await browser.newPage()

  // Ir a la URL
  log({ message: 'Going to youtube' })
  await page.goto('https://www.youtube.com')

  log({ message: 'Accepting youtube cookies' })
  const acceptAllButton = await page.waitForSelector(
    'button[aria-label="Accept the use of cookies and other data for the purposes described"]'
  )
  await acceptAllButton.click()

  await page.waitForNavigation()
  log({ message: 'Typing in the serach bar' })
  const searchInput = await page.$('input#search')

  await searchInput.type(searchValue)

  log({ message: 'Clicking on the search button' })
  await page.waitForFunction(`document.querySelector('input#search').value === '${searchValue}'`)

  await page.click('button#search-icon-legacy')

  await page.waitForNetworkIdle()
  log({ message: 'Selecting the videos' })
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
  log({ message: `${totalVideos} selected` })
  if (!totalVideos) {
    log({ message: 'Something went wrong, please try again ❌', err: true })
    process.exit(1)
  }
  log({ message: 'Formatting all the videos. This may take a while, please wait.' })

  const authors = []

  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    const { videoDetails } = await ytdl.getInfo(link)
    // console.log(videoDetails.description)
    if (!videoDetails.description) {
      console.log(video.title)
      console.log(videoDetails.description)
    }
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
      // author: authors[i],
      ...video,
      description: description ?? '',
      videoDuration: `${videoDuration} seconds`,
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
  log({ message: 'Videos formatted successfully!' })
  log({ message: 'Connecting to database...' })

  await connectToDb(URI)

  log({ message: 'Saving videos to database!. This may taye a while, please wait.' })
  saveDataToDb({ authors, videos }).finally(() => process.exit(1))
})()
