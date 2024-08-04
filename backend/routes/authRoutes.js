import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
// // @ Controllers Import
import {
  register,
  login,
  getUser,
  deleteUser,
} from '../controller/authControllers.js'
// // @ Validation Rules Import
import {
  validationRulesRegister,
  validationRulesLogin,
} from '../validationRules/authValidationRules.js'

const router = express.Router()

// // Create a new user and get token
router.post('/register', validationRulesRegister, register)

// // Authenticate user and get token
router.post('/login', validationRulesLogin, login)

// // Check token and get user from token
router.get('/verifyToken', authMiddleware, getUser)

// // Delete user after verifying token
router.delete('/delete', authMiddleware, deleteUser)

export default router
