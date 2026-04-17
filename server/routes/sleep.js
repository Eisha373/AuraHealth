import express from 'express'
import Sleep from '../models/Sleep.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { hours, quality } = req.body
    const entry = await Sleep.create({ user: req.user.id, hours, quality })
    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sleep = await Sleep.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(7)
    res.json(sleep)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router