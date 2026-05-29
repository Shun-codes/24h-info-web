import { Router } from 'express'
import * as ctrl from './listing.controller.js'
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware.js'
import { upload } from '../../middleware/upload.middleware.js'

const router = Router()

router.get('/',                  optionalAuth, ctrl.getListings)
router.post('/',                 requireAuth, upload.array('images', 5), ctrl.createListing)
router.get('/mine',              requireAuth, ctrl.getMyListings)
router.get('/favorites',         requireAuth, ctrl.getFavorites)
router.get('/:id',               optionalAuth, ctrl.getListing)
router.put('/:id',               requireAuth, ctrl.updateListing)
router.delete('/:id',            requireAuth, ctrl.deleteListing)
router.post('/:id/favorite',     requireAuth, ctrl.toggleFavorite)
router.post('/:id/report',       requireAuth, ctrl.reportListing)

export default router
