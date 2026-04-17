import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import moodRoutes from './routes/mood.js'
import sleepRoutes from './routes/sleep.js'
import waterRoutes from './routes/water.js'

app.use('/api/sleep', sleepRoutes)
// after authRoutes line
app.use('/api/mood', moodRoutes)
app.use('/api/water', waterRoutes)

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => console.log('❌ DB connection error:', err))