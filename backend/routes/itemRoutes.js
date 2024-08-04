import express, { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { validationRulesAddItem } from '../validationRules/authValidationRules.js'
// // @ Controllers Import
import {
  getItems,
  addItem,
  fetchItemById,
  modifyItem,
  getItemsLength,
  deleteItemById,
} from '../controller/itemController.js'

const router = express.Router()

// // Create a new item and return it
router.post('/add', authMiddleware, validationRulesAddItem, addItem)

// // Fetch all items for logged in user
router.get('/fetch', authMiddleware, getItems)

// // Fetch item by id for logged in user
router.get('/fetch/:_id', authMiddleware, fetchItemById)

// // Modify item by id for logged in user
router.put('/modify/:_id', authMiddleware, modifyItem)

// // Delete item by id for logged in user
router.delete('/delete/:_id', authMiddleware, deleteItemById)

// // Fetch total number of items
router.get('/length', authMiddleware, getItemsLength)

export default router
