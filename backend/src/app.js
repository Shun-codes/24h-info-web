import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { config } from 'dotenv'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'

config()

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Stricter limit on auth routes to prevent brute-force
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
}))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/api', routes)
app.use('/uploads', express.static('uploads'))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🌿 L'Uni Vert API — http://localhost:${PORT}`)
})

export default app
