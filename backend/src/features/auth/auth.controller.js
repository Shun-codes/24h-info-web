import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../users/user.model.js'

const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

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
