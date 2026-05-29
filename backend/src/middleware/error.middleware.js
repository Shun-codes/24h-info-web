export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} introuvable` })
}

export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack)

  // PostgreSQL constraint errors
  if (err.code === '23505') return res.status(409).json({ message: 'Cette ressource existe déjà' })
  if (err.code === '23503') return res.status(400).json({ message: 'Référence invalide' })
  if (err.code === '22P02') return res.status(400).json({ message: 'Format de données invalide' })

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Fichier trop volumineux (max 5 Mo)' })

  const status = err.status || err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
