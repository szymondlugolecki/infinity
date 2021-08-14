import { getSession } from 'next-auth/client'
import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'
import Trend from '../../../models/Trend'

import { extractHashtags } from '../../../lib/util'
import { cloudinary } from '../../../lib/cloudinary'

const handleTrends = async (trends) => {
  for await (const trend of trends) {
    const trendExists = await Trend.countDocuments({ name: trend.slice(1) })

    // if the trend does not exist, create one
    // if the trend already exists, increment its count

    if (trendExists == 0) await Trend.create({ name: trend.slice(1) })
    else await Trend.findOneAndUpdate({ name: trend.slice(1) }, { $inc: { count: 1 } })
  }
}

export default async function PostCreate(req, res) {
  const session = await getSession({ req })
  if (!session) throw new Error('You need to be logged in to do this')

  const { message, attachment } = req.body

  switch (req.method) {
    case 'POST':
      await dbConnect()

      const hashtags = extractHashtags(message)

      // check if the trend already exists

      handleTrends(hashtags)

      let response, avatar

      if (attachment)
        response = await cloudinary.uploader.upload(attachment, {
          transformation: {
            quality: 'auto',
            width: 500,
            height: 280,
            crop: 'fill',
            fetch_format: 'auto',
          },
        })

      if (response && response.secure_url) avatar = response.secure_url

      // const author = await User.findOne({ _id: session.user.id })

      const postCreated = await Post.create({
        content: message,
        hashtags,
        attachments: [avatar ? avatar : null],
        authorId: session.user.id,
        createdTs: Date.now(),
      })

      if (postCreated) res.status(200).json({ status: 'success' })

      if (response && !response.secure_url) {
        res.status(400).json({ status: 'error', message: 'Unexpected error occured while creating the post' })
        throw new Error('Unexpected error occured while creating the post')
      }

      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
