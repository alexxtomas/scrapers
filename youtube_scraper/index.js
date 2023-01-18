#!/usr/bin/env node
/* eslint-disable camelcase */
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

  const totalVideos = videos.length
  if (!totalVideos) {
    console.error('Something went wrong, please try again❌')
    process.exit(1)
  }

  console.log(`Saving ${totalVideos} videos. This may take a long time, please wait.🤖`)

  const authors = []

  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    const { videoDetails } = await ytdl.getInfo(link)
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
      ...video,
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
  }
}
scrape()
