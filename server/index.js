const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware — runs on every single request before your routes
app.use(cors())         // allows React (port 5173) to talk to Express (port 3000)
app.use(express.json()) // lets Express read JSON from request bodies

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})