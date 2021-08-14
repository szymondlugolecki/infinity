import Post from '../../models/Post'
import dbConnect from '../../lib/mongodb'

export default async function getPosts(req, res) {
  switch (req.method) {
    case 'GET':
      await dbConnect()

      const byProfile = JSON.parse(req.query.byProfile.toLowerCase())
      const skip = parseInt(req.query.skip)

      let posts

      if (!byProfile) {
        posts = await Post.find({}).limit(20).skip(skip)
      }

      if (posts) res.status(200).json({ status: 'success', posts })
      else res.status(200).json({ status: 'success', posts: [] })

      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}
