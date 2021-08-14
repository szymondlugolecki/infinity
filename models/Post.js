import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const now = () => Date.now()

const Post = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  content: String,
  authorId: String,
  createdTs: {
    type: Number,
    default: now(),
  },
  attachments: Array,
  hashtags: Array,
  likes: Array,
})

export default mongoose.models.Post || mongoose.model('Post', Post)
