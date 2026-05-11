import express from 'express'
import { signup, login, getProfile } from '../controllers/authController.js'
import authenticate from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// public routes
router.post('/signup', signup)
router.post('/login', login)

// protected route
router.get('/profile', authenticate, getProfile)

// temp admin route - delete after use
router.get('/make-admin/:email', async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.params.email },
    { role: 'admin' }
  )
  res.json({ message: 'Done! User is now admin' })
})

export default router