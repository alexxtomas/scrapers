import ytdl from 'ytdl-core'
export async function formatData({ authors, videos }) {
  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    try {
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
    } catch (err) {
      console.error(`Error when formatting ${video.title} ❌`)
    }
  }
}
