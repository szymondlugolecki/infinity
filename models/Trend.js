import mongoose from 'mongoose'

const Trend = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  count: {
    type: Number,
    default: 1,
  },
})

export default mongoose.models.Trend || mongoose.model('Trend', Trend)
