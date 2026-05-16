const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const applicationRoutes = require('./routes/applications')
const authMiddleware = require('./middleware/authMiddleware')
const prisma = require('./lib/prisma')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Public routes
app.use('/auth', authRoutes)

// Protected routes
app.use('/applications', applicationRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running!' })
})

// Get current user
app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    })
    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})