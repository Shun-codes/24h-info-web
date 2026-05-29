import jwt from 'jsonwebtoken'

/**
 * Middleware Express — exige un JWT valide dans l'en-tête Authorization.
 * Injecte `req.user = { id }` pour les handlers suivants.
 * Renvoie 401 si le token est absent, malformé ou expiré.
 */
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

/**
 * Middleware Express — décode le JWT si présent, sans bloquer les anonymes.
 * `req.user` est défini uniquement si le token est valide ; sinon `undefined`.
 * Utilisé sur les routes publiques qui personnalisent la réponse pour les
 * connectés (ex. : `is_favorited` sur le détail d'une annonce).
 */
export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
      req.user = { id: Number(payload.sub) }
    } catch {
      // Token invalide ignoré — l'utilisateur est traité comme anonyme
    }
  }
  next()
}

/**
 * Factory de middleware — restreint l'accès à certains rôles.
 * À chaîner après `requireAuth` : `requireAuth, requireRole('admin')`.
 *
 * @param {...string} roles - Rôles autorisés ('user', 'moderator', 'admin').
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' })
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé' })
  }
  next()
}
