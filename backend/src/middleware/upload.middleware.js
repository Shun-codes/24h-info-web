import multer from 'multer'
import path from 'path'
import { randomUUID } from 'crypto'
import { mkdirSync } from 'fs'

mkdirSync('uploads', { recursive: true })

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${randomUUID()}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(Object.assign(new Error('Format non supporté. Utilisez JPEG, PNG ou WebP.'), { status: 400 }))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
