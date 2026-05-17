import express from 'express'
import User from '../models/User.js'
import Article from '../models/Article.js'
import Quiz from '../models/Quiz.js'
import authenticate from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const router = express.Router()

router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalArticles, totalQuizzes] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Quiz.countDocuments()
    ])
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email branch createdAt')
    res.json({ totalUsers, totalArticles, totalQuizzes, recentUsers })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
})

export default router