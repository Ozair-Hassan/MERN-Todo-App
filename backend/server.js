import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoutes.js'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}
const port = process.env.PORT || 5000
connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/item', itemRoutes)
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

export default app
