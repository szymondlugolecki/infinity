import { getSession } from 'next-auth/client'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import Comment from '../../../models/Comment'

export default async function CreateComment(req, res) {
  const session = await getSession({ req })
  if (!session)
    return res.status(400).json({ status: 'error', message: 'You need to be logged in to do this' })

  const { authorUsername, postId, content } = req.body

  if (!postId || !content)
    return res.status(400).json({ status: 'error', message: 'Too little data provided' })

  switch (req.method) {
    case 'POST':
      await dbConnect()

      const author = await User.findOne({ _id: session.user.id })

      const commentCreated = await Comment.create({
        authorId: author._id,
        postId: postId,
        content,
        createdTs: Date.now(),
      })

      if (commentCreated) res.status(200).json({ status: 'success' })
      else
        res
          .status(400)
          .json({ status: 'error', message: 'Unexpected error occured while posting the comment' })

      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}
