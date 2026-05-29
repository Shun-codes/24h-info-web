import { Router } from 'express'
import authRoutes     from '../features/auth/auth.routes.js'
import listingRoutes  from '../features/listings/listing.routes.js'
import userRoutes     from '../features/users/user.routes.js'
import categoryRoutes from '../features/categories/category.routes.js'
import messageRoutes  from '../features/messages/message.routes.js'

const router = Router()

router.get('/health', (_, res) => res.json({ status: 'ok', service: "L'Uni Vert API" }))

router.use('/auth',       authRoutes)
router.use('/listings',   listingRoutes)
router.use('/users',      userRoutes)
router.use('/categories', categoryRoutes)
router.use('/messages',   messageRoutes)

export default router
