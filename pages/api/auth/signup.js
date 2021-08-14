import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

const { hash } = require('bcryptjs')

export default async function Signup(req, res) {
  switch (req.method) {
    case 'POST':
      await dbConnect()

      // * -------------------------------------
      // * HANDLE INVALID DATA
      // * -------------------------------------

      let { email, password, username } = Object.assign({}, req.body)

      username = username.toLowerCase()

      if (!email || !password || !username)
        return res.status(400).json({ status: 'error', message: 'Invalid data' })

      const usernameErrors = usernameValidator(username)
      const passErrors = passwordValidator(password)
      const emailErrors = emailValidator(email)

      if (usernameErrors.length > 0 || passErrors.length > 0 || emailErrors.length > 0)
        return res
          .status(400)
          .json({ status: 'error', errors: [...usernameErrors, ...passErrors, ...emailErrors] })

      // * -------------------------------------
      // * -------------------------------------
      // * -------------------------------------

      // @ -------------------------------------
      // @ HANDLE DUPLICATES
      // @ -------------------------------------

      const sameUsername = await User.find({ username })
      if (sameUsername[0])
        return res.status(409).json({ status: 'error', message: 'Account with this username already exists' })

      const sameEmail = await User.find({ email })
      if (sameEmail[0])
        return res.status(409).json({ status: 'error', message: 'Account with this email already exists' })

      // @ -------------------------------------
      // @ -------------------------------------
      // @ -------------------------------------

      // ! -------------------------------------
      // ! HASH AND CREATE THE ACCOUNT
      // ! -------------------------------------

      try {
        const hashedPassword = await hash(password, 11)
        await User.create({
          email,
          password: hashedPassword,
          username,
          avatar: '/def_pp.png',
          createdTs: Date.now(),
        })
        res.status(200).json({ status: 'success' })
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error while hashing the password' })
        throw new Error(error)
      }

      // ! -------------------------------------
      // ! -------------------------------------
      // ! -------------------------------------

      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${httpMethod} Not Allowed`)
  }
}

function emailValidator(e) {
  const errors = []

  if (e.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) < 0)
    errors.push('The email you provided is invalid')

  return errors
}

function passwordValidator(p) {
  const errors = []

  // 8 - 31 characters long
  // at least one digit
  // at least one letter

  if (p.length < 8) errors.push('Your password must be at least 8 characters')

  if (p.length >= 32) errors.push('Your password must be under 32 characters long')

  if (p.search(/[a-z]/i) < 0) errors.push('Your password must contain at least one letter')

  if (p.search(/[0-9]/) < 0) errors.push('Your password must contain at least one digit')

  return errors
}

function usernameValidator(u) {
  const errors = []

  // 4 - 16 characters
  // no special characters (except: - and _)
  // numbers allowed

  if (u.length < 4) errors.push('Your username must be at least 4 characters')

  if (u.length > 16) errors.push('Your username must be 16 characters or less')

  if (u.search(/^[a-z0-9_-]{4,16}$/) < 0) errors.push('Your username must contain at least one letter')

  return errors
}
