import { Router } from 'express'
import * as ctrl from './message.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = Router()

router.get('/',                      requireAuth, ctrl.getConversations)
router.post('/',                     requireAuth, ctrl.sendMessage)
router.get('/thread/:listingId',     requireAuth, ctrl.getThread)
router.patch('/:id/read',            requireAuth, ctrl.markRead)

export default router
