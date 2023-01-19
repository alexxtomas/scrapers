import { Author } from '../../models/author_model.js'
import { Video } from '../../models/video_model.js'
import { log } from '../log.js'
export async function saveDataToDb({ authors, videos }) {
  Promise.all([await Author.insertMany(authors), await Video.insertMany(videos)])
    .then(() => {
      log({
        message: 'All videos and their authors have been saved to the database successfully 🚀'
      })
    })
    .catch((err) => {
      log({ message: 'Error while saving data to database ❌', err: true })
      throw err
    })
}
