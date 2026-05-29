import { MessageModel } from './message.model.js'
import { ListingModel } from '../listings/listing.model.js'

export const sendMessage = async (req, res, next) => {
  try {
    const { listing_id, content } = req.body
    if (!listing_id || !content?.trim()) {
      return res.status(400).json({ message: 'Annonce et message requis' })
    }

    const listing = await ListingModel.findById(listing_id)
    if (!listing) return res.status(404).json({ message: 'Annonce introuvable' })
    if (listing.user_id === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous écrire à vous-même' })
    }

    const message = await MessageModel.send({
      listing_id,
      sender_id: req.user.id,
      receiver_id: listing.user_id,
      content: content.trim(),
    })

    res.status(201).json(message)
  } catch (err) {
    next(err)
  }
}

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await MessageModel.getConversations(req.user.id)
    res.json(conversations)
  } catch (err) {
    next(err)
  }
}

export const getThread = async (req, res, next) => {
  try {
    const messages = await MessageModel.getThread(req.user.id, req.params.listingId)
    res.json(messages)
  } catch (err) {
    next(err)
  }
}

export const markRead = async (req, res, next) => {
  try {
    await MessageModel.markRead(req.params.id, req.user.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
