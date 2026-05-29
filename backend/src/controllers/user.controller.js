import { UserModel } from '../models/user.model.js'

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
    const { name, phone, city } = req.body
    const avatar_url = req.file ? `/uploads/${req.file.filename}` : undefined

    const user = await UserModel.update(req.user.id, { name, phone, city, avatar_url })
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
