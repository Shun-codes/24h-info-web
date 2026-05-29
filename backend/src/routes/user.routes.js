import { Router } from 'express'
import * as ctrl from '../controllers/user.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'

const router = Router()

router.get('/:id',           ctrl.getProfile)
router.put('/me',            requireAuth, upload.single('avatar'), ctrl.updateProfile)
router.delete('/me',         requireAuth, ctrl.deleteAccount)

export default router
