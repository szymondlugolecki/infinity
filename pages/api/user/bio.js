import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { getSession } from 'next-auth/client'

export default async function Bio(req, res) {
  const session = await getSession({ req })

  const body = Object.assign({}, req.body)

  if (!session) return res.send({ allowed: 'You are not logged in' })

  switch (req.method) {
    case 'POST':
      await dbConnect()
      const result = await User.updateOne({ _id: session.user.id }, { $set: { bio: body.bio } })
      if (!result) {
        res.status(400).json({ status: 'error' })
        throw new Error('Unexpected error!')
      }
      res.status(200).json({ status: 'success' })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}
