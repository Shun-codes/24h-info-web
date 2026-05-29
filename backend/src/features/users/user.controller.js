import { UserModel } from './user.model.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const name = req.body.name?.trim()
    const phone = req.body.phone?.trim() || null
    const city = req.body.city?.trim() || null
    const avatar_url = req.file ? `/uploads/user/${req.file.filename}` : undefined

    if (!email || !name) {
      return res.status(400).json({ message: 'Email et nom requis' })
    }

    const existing = await UserModel.findByEmail(email)
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' })
    }

    const user = await UserModel.update(req.user.id, { email, name, phone, city, avatar_url })
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const deleteAccount = async (req, res, next) => {
  try {
    await UserModel.delete(req.user.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
