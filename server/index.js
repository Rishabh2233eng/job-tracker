const express = require('express')
const cors = require('cors')
require('dotenv').config()

const prisma = require('./lib/prisma')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running!' })
})

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count()
    res.json({ 
      message: 'Database connected!', 
      userCount 
    })
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})