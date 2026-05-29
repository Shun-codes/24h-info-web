import multer from 'multer'
import path, { dirname } from 'path'
import { randomUUID } from 'crypto'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(__dirname, '../../public/uploads/user')

// Crée le dossier uploads au démarrage si absent (Docker volume vide)
mkdirSync(uploadDir, { recursive: true })

// Stockage sur disque : UUID comme nom de fichier pour éviter les conflits
// et ne pas exposer le nom original (risque d'énumération ou de path traversal)
const storage = multer.diskStorage({
  destination: uploadDir,
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

/**
 * Instance Multer configurée pour les images d'annonces et les avatars.
 * Limites : JPEG / PNG / WebP uniquement, 5 Mo max par fichier.
 * Usage : `upload.array('images', 5)` pour plusieurs fichiers,
 *         `upload.single('avatar')` pour un seul.
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
