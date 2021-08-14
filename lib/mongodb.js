import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const username = process.env.DB_USERNAME
const password = process.env.DB_PASS

export default async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise)
    cached.promise = mongoose
      .connect('mongodb://localhost:27017/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
        useFindAndModify: false,
        useCreateIndex: true,
        authSource: 'admin',
        user: username,
        pass: password,
      })
      .then((mongoose) => {
        console.log('Successfully connected to the DB')
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
          console.log('Open')
        })
        return mongoose
      })

  cached.conn = await cached.promise
  return cached.conn
}
