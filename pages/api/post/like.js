import { getSession } from 'next-auth/client'
import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'

export default async function PostLike(req, res) {
  const session = await getSession({ req })
  if (!session)
    return res.status(400).json({ status: 'error', message: 'You need to be logged in to do this' })

  const { postId, like } = req.body

  if (!postId || ![true, false].includes(like))
    return res.status(400).json({ status: 'error', message: 'Too little data provided' })

  switch (req.method) {
    case 'POST':
      await dbConnect()

      const thePost = await Post.findOne({ _id: postId })
      if (!thePost) return res.status(400).json({ status: 'error', message: 'Invalid data' })

      let result

      if (thePost.likes.includes(session.user.id) && !like)
        result = await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: session.user.id } })

      if (!thePost.likes.includes(session.user.id) && like)
        result = await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: session.user.id } })

      if (result) return res.status(200).json({ status: 'success' })

      res
        .status(500)
        .json({ status: 'error', message: 'Unexpected error occured while reacting to the comment' })

      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}
