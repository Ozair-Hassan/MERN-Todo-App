import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
const Item = mongoose.model('Item', ItemSchema)
export default Item
