const PREFIX = 'Youtube Scraper 🤖 - '

export function log({ message, err = false }) {
  if (!err) {
    console.log(PREFIX, message)
  } else {
    console.error(PREFIX, message)
  }
}
