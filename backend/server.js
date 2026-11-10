
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

// Test API
app.get('/', (req, res) => {
  res.send('FitTrack Backend is Running!')
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!')

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message)
  })
