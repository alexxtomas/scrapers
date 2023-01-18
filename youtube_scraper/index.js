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

  console.log(videos)

  if (!videos.length) {
    console.error('Something went wrong, please try again❌')
    process.exit(1)
  }

  const totalVideos = videos.length

  console.log(`Saving ${totalVideos} videos. This may take a long time, please wait.🤖`)

  // console.log(await ytdl.getInfo(videos[0].link))
  const videosInfo = []

  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    await ytdl
      .getInfo(link)
      .then(
        ({
          description,
          lengthSeconds: videoDuration,
          isFamilySafe,
          viewCount,
          category,
          publishDate,
          keywords,
          author,
          isPrivate,
          isLiveContent,
          likes,
          dislikes,
          age_restricted: ageRestricted
        }) => {
          videos[i] = {
            ...video,
            description,
            videoDuration,
            isFamilySafe,
            viewCount,
            category,
            publishDate,
            keywords,
            author: {
              name: author?.name,
              user: author?.user,
              channelURL: author?.channel_url,
              userURL: author?.user_url,
              verified: author?.verified,
              suscribers: author?.suscriber_count
            },
            isPrivate,
            isLiveContent,
            likes,
            dislikes,
            ageRestricted
          }
        }
      )
  }
  console.log(videos)
  // const formattedInfo = videosInfo.map(
  //   ({
  //     title,
  //     description,
  //     lengthSeconds,
  //     isFamilySafe,
  //     viewCount,
  //     category,
  //     publishDate,
  //     keywords,
  //     author,
  //     isPrivate,
  //     isLiveContent,
  //     likes,
  //     dislikes,
  //     age_restricted,
  //     video_url
  //   }) => ({
  //     title,
  //     description,
  //     videoDuration: lengthSeconds,
  //     isFamilySafe,
  //     viewCount,
  //     category,
  //     publishDate,
  //     keywords,
  //     author: {
  //       name: author?.name ?? 'Unknown',
  //       user: author?.user ?? 'Unknown',
  //       channelURL: author?.channel_url ?? 'Unknown',
  //       userURL: author?.user_url ?? 'Unknown',
  //       verified: author?.verified ?? 'Unknown',
  //       suscribers: author?.suscriber_count ?? 'Unknown'
  //     },
  //     isPrivate,
  //     isLiveContent,
  //     likes: likes ?? 'Unknown',
  //     dislikes: dislikes ?? 'Unknown',
  //     ageRestricted: age_restricted,
  //     videoURL: video_url
  //   })
  // )
  // console.log(formattedInfo)
}
scrape()
