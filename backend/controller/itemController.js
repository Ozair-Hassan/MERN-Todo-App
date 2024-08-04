import express from 'express'
import Item from '../models/ItemModel.js'
import { validationResult } from 'express-validator'

// @route GET api/items/fetch
// @desc Get all user items and items marked as public
// @access Private
export const getItems = async (req, res) => {
  try {
    let items
    const userId = req.user.id
    const startIndex = parseInt(req.query.starting) || 0
    const endIndex = parseInt(req.query.ending) || 6
    const limit = Math.max(endIndex - startIndex, 0)
    const isDone = req.query.isDone === 'true'
    const category = req.query.selectedCategory
    const visibility = req.query.selectedVisibility

    const sortingOrder = parseInt(req.query.selectedPriority)

    let queryCondition = {
      $or: [{ userId }, { visibility: 'Public' }],
      isDone,
    }
    if (category !== 'All') {
      queryCondition.category = category
    }
    if (visibility !== 'Public') {
      queryCondition.visibility = visibility
    }
    if (Math.abs(sortingOrder) === 1) {
      items = await Item.find(queryCondition)
        .sort({ priority: sortingOrder })
        .populate('userId', 'fullName')
        .skip(startIndex)
        .limit(limit)
    } else {
      items = await Item.find(queryCondition)
        .populate('userId', 'fullName')
        .skip(startIndex)
        .limit(limit)
    }

    const uniqueItems = Array.from(
      new Map(items.map((item) => [item['_id'], item])).values()
    )

    res.status(200).json(uniqueItems)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route GET api/items/length
// @desc Get number of total items
// @access Private
export const getItemsLength = async (req, res) => {
  try {
    const userId = req.user.id
    const isDone = req.query.isDone === 'true'
    const category = req.query.selectedCategory
    const visibility = req.query.selectedVisibility

    let queryCondition = {
      $or: [{ userId }, { visibility: 'Public' }],
      isDone,
    }

    if (category !== 'All') {
      queryCondition.category = category
    }

    if (visibility !== 'Public') {
      queryCondition.visibility = visibility
    }

    const itemsNumber = await Item.countDocuments(queryCondition)

    res.status(200).json(itemsNumber)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route POST api/item/add
// @desc Add a new item
// @access Private
export const addItem = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { title, description, priority, category, visibility, isDone } =
    req.body
  try {
    const userId = req.user.id
    const newItem = new Item({
      userId,
      title,
      description,
      priority,
      category,
      visibility,
      isDone,
    })

    await newItem.save()
    res.status(200).json(newItem)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route PUT api/item/modify/:_id
// @desc Modify an existing item
// @access Private
export const modifyItem = async (req, res) => {
  const { title, description, priority, category, visibility, isDone } =
    req.body

  try {
    const itemId = req.params._id
    const userId = req.user.id
    console.log(priority)
    const item = await Item.findOneAndUpdate(
      { _id: itemId, userId },
      {
        title,
        description,
        priority,
        category,
        visibility,
        isDone,
      },
      { new: true }
    )

    if (!item) {
      return res
        .status(404)
        .json({ msg: 'Item not found or user not authorized to modify it' })
    }

    res.status(200).json(item)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route GET api/item/fetch/:_id
// @desc Get item by specifc id
// @access Private
export const fetchItemById = async (req, res) => {
  try {
    const itemId = req.params._id
    const userId = req.user.id

    const item = await Item.findOne({ _id: itemId, userId })

    if (!item) {
      return res.status(404).json({
        msg: 'Item not found or you do not have permission to view it.',
      })
    }

    res.json(item)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}

// @route DELETE api/item/delete/:_id
// @desc Get item by specifc id and delete it
// @access Private
export const deleteItemById = async (req, res) => {
  try {
    const itemId = req.params._id
    const userId = req.user.id

    const item = await Item.findOneAndDelete({ _id: itemId, userId })

    if (!item) {
      return res.status(404).json({
        msg: 'Item not found or you do not have permission to delete it.',
      })
    }

    res.json({ msg: 'Item successfully deleted.' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
}
