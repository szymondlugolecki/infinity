import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { getSession } from 'next-auth/client'
import { cloudinary } from '../../../lib/cloudinary'

export default async function UserAvatar(req, res) {
  switch (req.method) {
    case 'POST':
      const session = await getSession({ req })

      if (!session) throw new Error('You need to be logged in to do this')

      const response = await cloudinary.uploader.upload(req.body, {
        transformation: {
          height: 112,
          width: 112,
          quality: 'auto:good',
          crop: 'fill',
          gravity: 'faces',
          radius: 'max',
          background: 'transparent',
          quality: 'auto',
          fetch_format: 'auto',
        },
      })

      if (response && response.secure_url) {
        await dbConnect()

        const avatar = response.secure_url

        const result = await User.updateOne({ _id: session.user.id }, { $set: { avatar } })
        if (!result) throw new Error('Unexpected error!')

        res.status(200).json({ status: 'success', image: avatar })
      } else res.status(400).json({ status: 'error' })
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
