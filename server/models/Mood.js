import express from 'express'
import Mood from '../models/Mood.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Save mood
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mood, label, note } = req.body
    const entry = await Mood.create({ user: req.user.id, mood, label, note })
    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get mood history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(7)
    res.json(moods)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router