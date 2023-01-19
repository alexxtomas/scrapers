export function extractVideoToSearch() {
  const [, , ...videoToSearch] = process.argv

  if (videoToSearch.length > 1) {
    console.log(
      'If the product name contains spaces, enter the product name in quotes like this "star wars"🤖'
    )
    process.exit(1)
  }

  if (!videoToSearch.length) {
    console.log('Please provide a product to search!!!🤖')
    process.exit(1)
  }

  return { videoToSearch, formattedVideoToSearch: videoToSearch.replaceAll(' ', '_') }
}
