import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const now = () => Date.now()

const Comment = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  postId: String,
  content: String,
  authorId: String,
  createdTs: {
    type: Number,
    default: now(),
  },
  likes: Array,
})

export default mongoose.models.Comment || mongoose.model('Comment', Comment)
