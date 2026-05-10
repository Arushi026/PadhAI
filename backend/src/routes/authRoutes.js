import express from 'express'
import { signup, login, getProfile } from '../controllers/authController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()

// public routes
router.post('/signup', signup)
router.post('/login', login)

// protected route
router.get('/profile', authenticate, getProfile)

export default router