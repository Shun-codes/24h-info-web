/** Fallback 404 — enregistré après toutes les routes réelles. */
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} introuvable` })
}

/**
 * Gestionnaire d'erreurs global Express (signature à 4 arguments obligatoire).
 * Traduit les codes d'erreur PostgreSQL et Multer en réponses HTTP lisibles.
 * La stack trace est incluse uniquement en développement pour ne pas fuiter
 * d'informations internes en production.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack)

  // Codes d'erreur PostgreSQL — contraintes d'intégrité
  if (err.code === '23505') return res.status(409).json({ message: 'Cette ressource existe déjà' })
  if (err.code === '23503') return res.status(400).json({ message: 'Référence invalide' })
  if (err.code === '22P02') return res.status(400).json({ message: 'Format de données invalide' })

  // Multer — fichier trop grand (fileSize limit)
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Fichier trop volumineux (max 5 Mo)' })

  const status = err.status || err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
