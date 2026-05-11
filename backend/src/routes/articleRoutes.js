import express from 'express'
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} from '../controllers/articleController.js'
import authenticate from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const router = express.Router()

// public routes
router.get('/', getArticles)
router.get('/:id', getArticle)

// protected routes (admin only)
router.post('/', authenticate, isAdmin, createArticle)
router.put('/:id', authenticate, isAdmin, updateArticle)
router.delete('/:id', authenticate, isAdmin, deleteArticle)

export default router