export function extractVideoToSearch() {
  const [, , ...valueProvided] = process.argv

  if (valueProvided.length > 1) {
    console.log(
      'If the product name contains spaces, enter the product name in quotes like this "star wars"🤖'
    )
    process.exit(1)
  }

  if (!valueProvided.length) {
    console.log('Please provide a product to search!!!🤖')
    process.exit(1)
  }
  const [videoToSearch] = valueProvided

  return { videoToSearch, formattedVideoToSearch: videoToSearch.replaceAll(' ', '_') }
}
