import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const now = () => Date.now()

const User = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  username: {
    type: String,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
  },
  joinedTs: {
    type: Number,
    default: now(),
  },
  email: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
    default: '/def_pp.png',
  },
  password: String,
})

export default mongoose.models.User || mongoose.model('User', User)
