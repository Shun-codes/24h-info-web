import { ListingModel } from './listing.model.js'

export const getListings = async (req, res, next) => {
  try {
    const { search, category, city, min_price, max_price, limit, offset } = req.query
    const listings = await ListingModel.findAll({
      search,
      category,
      city,
      min_price: min_price !== undefined ? Number(min_price) : undefined,
      max_price: max_price !== undefined ? Number(max_price) : undefined,
      limit: Math.min(Number(limit) || 20, 100),
      offset: Number(offset) || 0,
    })
    res.json(listings)
  } catch (err) {
    next(err)
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await ListingModel.findById(req.params.id, req.user?.id ?? null)
    if (!listing) return res.status(404).json({ message: 'Annonce introuvable' })
    res.json(listing)
  } catch (err) {
    next(err)
  }
}

export const createListing = async (req, res, next) => {
  try {
    const { title, description, price, city, category_id, contact_method } = req.body

    if (!title || !price || !city) {
      return res.status(400).json({ message: 'Titre, prix et ville requis' })
    }

    const listing = await ListingModel.create({
      user_id: req.user.id,
      category_id,
      title,
      description,
      price,
      city,
      contact_method: contact_method || 'message',
    })

    if (req.files?.length) {
      const urls = req.files.map((f) => `/uploads/${f.filename}`)
      await ListingModel.addImages(listing.id, urls)
    }

    res.status(201).json(listing)
  } catch (err) {
    next(err)
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await ListingModel.update(req.params.id, req.user.id, req.body)
    if (!listing) return res.status(404).json({ message: 'Annonce introuvable ou non autorisé' })
    res.json(listing)
  } catch (err) {
    next(err)
  }
}

export const deleteListing = async (req, res, next) => {
  try {
    const deleted = await ListingModel.delete(req.params.id, req.user.id)
    if (!deleted) return res.status(404).json({ message: 'Annonce introuvable ou non autorisé' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export const getMyListings = async (req, res, next) => {
  try {
    const listings = await ListingModel.findByUser(req.user.id)
    res.json(listings)
  } catch (err) {
    next(err)
  }
}

export const toggleFavorite = async (req, res, next) => {
  try {
    const result = await ListingModel.toggleFavorite(req.user.id, req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getFavorites = async (req, res, next) => {
  try {
    const listings = await ListingModel.getFavorites(req.user.id)
    res.json(listings)
  } catch (err) {
    next(err)
  }
}

export const reportListing = async (req, res, next) => {
  try {
    const { reason, description } = req.body
    if (!reason) return res.status(400).json({ message: 'Motif requis' })
    await ListingModel.report(req.params.id, req.user.id, { reason, description })
    res.status(201).json({ message: 'Signalement envoyé' })
  } catch (err) {
    next(err)
  }
}
