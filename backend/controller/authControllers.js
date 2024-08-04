import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/UserModel.js'

const generateJWT = (userId) => {
  const payload = { user: { id: userId } }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '999h' })
}

// @route  GET api/auth/verifyToken
// @desc   Authentication route
// @access Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
}

// @route  POST api/auth/register
// @desc   Register a user, create a profile, and get token
// @access Public
export const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let { email, password, fullName } = req.body

  email = email.toLowerCase()
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    const user = new User({ email, password, fullName })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const token = generateJWT(user.id)

    res.status(200).json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// // @route  POST api/auth/login
// // @desc   Authenticate user and get token
// // @access Public
export const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let { email, password } = req.body
  email = email.toLowerCase()

  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials ' }] })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials ' }] })
    }

    const token = generateJWT(user.id)

    res.status(200).json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route  DELETE api/auth/delete
// @desc   Delete user
// @access Private
export const deleteUser = async (req, res) => {
  try {
    // Remove user
    await User.findOneAndDelete({ _id: req.user.id })

    res.status(204).send()
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
}
