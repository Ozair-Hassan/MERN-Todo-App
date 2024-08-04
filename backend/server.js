import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoutes.js'

// Load environment variables based on the environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}

const port = process.env.PORT || 5000
connectDB()

const app = express()
app.use(express.json())

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/item', itemRoutes)

// Log the current environment
console.log(`Running in ${process.env.NODE_ENV} mode`)

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // Log the paths for debugging
  const staticFilesPath = path.join(__dirname, '../frontend/dist')
  const indexPath = path.resolve(__dirname, '../frontend/dist', 'index.html')

  console.log('Serving static files from:', staticFilesPath)
  console.log('Index file path:', indexPath)

  // Serve the static files from the dist directory
  app.use(express.static(staticFilesPath))

  // Handle any other routes to serve the index.html file
  app.get('*', (req, res) => res.sendFile(indexPath))
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

export default app
