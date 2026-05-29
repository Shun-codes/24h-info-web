import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../users/user.model.js'

/**
 * Génère un JWT signé avec l'ID utilisateur en claim `sub`.
 * Durée configurable via JWT_EXPIRES_IN (défaut : 7 jours).
 *
 * @param {number} userId
 * @returns {string} token JWT
 */
const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

/**
 * POST /api/auth/register
 * Crée un compte et renvoie immédiatement un token (pas de double étape).
 * Le mot de passe est hashé avec bcrypt (12 rounds) avant stockage.
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, city } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, mot de passe et nom requis' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' })
    }

    const existing = await UserModel.findByEmail(email)
    if (existing) return res.status(409).json({ message: 'Cet email est déjà utilisé' })

    const hashed = await bcrypt.hash(password, 12)
    const user = await UserModel.create({ email, password: hashed, name, phone, city })

    res.status(201).json({ token: signToken(user.id), user })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Vérifie les identifiants et renvoie un token.
 * Le message d'erreur est volontairement générique ("Identifiants incorrects")
 * pour ne pas révéler si l'email existe ou non (énumération d'utilisateurs).
 * La vérification du bannissement est faite après bcrypt.compare pour ne pas
 * créer un chemin d'exécution plus rapide qui permettrait de distinguer
 * "email inconnu" de "compte banni".
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    const user = await UserModel.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    if (user.is_banned) {
      return res.status(403).json({ message: 'Compte suspendu, contactez le support' })
    }

    // Exclure le hash du mot de passe de la réponse
    const { password: _, ...safeUser } = user
    res.json({ token: signToken(user.id), user: safeUser })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Champs requis manquants' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
    }

    const user = await UserModel.findById(req.user.id)
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await UserModel.updatePassword(req.user.id, hashed)
    res.json({ message: 'Mot de passe mis à jour' })
  } catch (err) {
    next(err)
  }
}
