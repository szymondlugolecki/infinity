import { getSession } from 'next-auth/client'
import dbConnect from '../../../lib/mongodb'
import Comment from '../../../models/Comment'

export default async function CommentLike(req, res) {
  const session = await getSession({ req })
  if (!session)
    return res.status(400).json({ status: 'error', message: 'You need to be logged in to do this' })

  const { commentId, like } = req.body

  if (!commentId || ![true, false].includes(like))
    return res.status(400).json({ status: 'error', message: 'Too little data provided' })

  switch (req.method) {
    case 'POST':
      await dbConnect()

      const theComment = await Comment.findOne({ _id: commentId })
      if (!theComment) return res.status(400).json({ status: 'error', message: 'Invalid data' })

      let result

      if (theComment.likes.includes(session.user.id) && !like)
        result = await Comment.findOneAndUpdate({ _id: commentId }, { $pull: { likes: session.user.id } })

      if (!theComment.likes.includes(session.user.id) && like)
        result = await Comment.findOneAndUpdate({ _id: commentId }, { $push: { likes: session.user.id } })

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
