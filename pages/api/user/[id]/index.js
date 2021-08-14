import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'

export default async function UserInfo(req, res) {
  switch (req.method) {
    case 'GET':
      let { id, avatar, bio } = req.query

      await dbConnect()

      if (avatar.toLowerCase() === 'true') avatar = true
      if (bio.toLowerCase() === 'true') avatar = true

      const result = await User.findOne({ _id: id })

      if (result) {
        const jsonObject = { status: 'success' }
        if (avatar) jsonObject.avatar = result.avatar
        if (bio) jsonObject.bio = result.bio
        res.status(200).json(jsonObject)
      } else res.status(400).json({ status: 'error' })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}
