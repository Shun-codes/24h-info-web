import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' })
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    req.user = { id: Number(payload.sub) }
    next()
  } catch {
    res.status(401).json({ message: 'Token expiré ou invalide' })
  }
}

export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
      req.user = { id: Number(payload.sub) }
    } catch {
      // Token invalide ignoré pour les routes optionnelles
    }
  }
  next()
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' })
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé' })
  }
  next()
}
