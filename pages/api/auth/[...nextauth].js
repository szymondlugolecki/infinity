import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

const { compare } = require('bcryptjs')

export default async function Auth(req, res) {
  await dbConnect()

  return NextAuth(req, res, {
    session: {
      jwt: true,
    },
    jwt: {
      encryption: true,
    },
    database: process.env.DATABASE_URL,
    callbacks: {
      async jwt(token, user, account, profile, isNewUser) {
        if (user && user.username) token.user = user

        return token
      },
      session: async (session, user, sessionToken) => {
        session.user = user.user
        return session
      },
    },
    providers: [
      Providers.Credentials({
        name: 'Infinity',
        credentials: {
          username: { label: 'Username or email', type: 'text', placeholder: 'Username or email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize({ username, password }) {
          const user = (await User.findOne({ username })) || (await User.findOne({ email: username }))

          if (!user) throw new Error('No user was found with this username')

          const checkPassword = await compare(password, user.password)
          if (!checkPassword) {
            throw new Error('Incorrect password')
          }
          return { username: user.username, email: user.email, avatar: user.avatar, id: user._id }
        },
      }),
    ],
  })
}
