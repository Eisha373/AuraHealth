import express from 'express'
import Water from '../models/Water.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { glasses } = req.body
    const entry = await Water.create({ user: req.user.id, glasses })
    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const water = await Water.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(7)
    res.json(water)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router