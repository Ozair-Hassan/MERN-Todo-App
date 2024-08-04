import { check, validationResult } from 'express-validator'

// Validation rules for registering a new user
export const validationRulesRegister = [
  check('fullName', 'Full name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
]

// Validation rules for logging in a user
export const validationRulesLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
]

// Validation rules for adding a new item
export const validationRulesAddItem = [
  check('title', 'Full name is required').not().isEmpty(),
  check('description', 'Full name is required').not().isEmpty(),
  check('priority', 'Full name is required').not().isEmpty(),
  check('category', 'Full name is required').not().isEmpty(),
  check('visibility', 'Full name is required').not().isEmpty(),
  check('isDone', 'Full name is required').not().isEmpty(),
]
