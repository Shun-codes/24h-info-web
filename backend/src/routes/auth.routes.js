import { Router } from 'express'
import { login, register, getMe, updatePassword } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        requireAuth, getMe)
router.put('/password',  requireAuth, updatePassword)

export default router
