import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token

  // Get token from header
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.user.id).select('-password')

      next()
    } catch (error) {
      res.status(401).json('Token is not valid')
    }
  }

  if (!token) {
    res.status(403).json('No token, authorization denied')
  }
})

export default authMiddleware
