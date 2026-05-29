import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'

config()

const app        = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

// Auth middleware pour les sockets
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Non authentifié'))
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = Number(payload.sub)
    next()
  } catch {
    next(new Error('Token invalide'))
  }
})

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`)
})

// Rendre io accessible dans les contrôleurs via req.app.get('io')
app.set('io', io)

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
}))

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/api', routes)
app.use('/uploads', express.static('uploads'))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`🌿 L'Uni Vert API — http://localhost:${PORT}`)
})

export default app
