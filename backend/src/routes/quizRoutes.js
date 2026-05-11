import express from 'express'
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  deleteQuiz,
  submitQuiz
} from '../controllers/quizController.js'
import authenticate from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const router = express.Router()

// public routes
router.get('/', getQuizzes)
router.get('/:id', getQuiz)

// admin only
router.post('/', authenticate, isAdmin, createQuiz)
router.delete('/:id', authenticate, isAdmin, deleteQuiz)

// student route
router.post('/:id/submit', authenticate, submitQuiz)

export default router