import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/database.js')

import db from '../../config/database.js'
import { MessageModel } from './message.model.js'

describe('MessageModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('send', () => {
    it('insère le message et retourne la ligne créée', async () => {
      const msg = { id: 1, listing_id: 2, sender_id: 3, receiver_id: 4, content: 'Bonjour, toujours disponible ?' }
      db.query.mockResolvedValue({ rows: [msg] })

      const result = await MessageModel.send({ listing_id: 2, sender_id: 3, receiver_id: 4, content: msg.content })

      expect(result).toEqual(msg)
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO messages'),
        [2, 3, 4, msg.content],
      )
    })
  })

  describe('getConversations', () => {
    it('retourne les conversations de l\'utilisateur', async () => {
      const convs = [
        { id: 1, listing_id: 2, other_user_id: 5, other_user_name: 'Bob' },
      ]
      db.query.mockResolvedValue({ rows: convs })
      const result = await MessageModel.getConversations(1)
      expect(result).toEqual(convs)
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1])
    })

    it('utilise DISTINCT ON pour dédoublonner par conversation', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await MessageModel.getConversations(1)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('DISTINCT ON')
    })

    it('construit la clé de conversation avec LEAST/GREATEST', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await MessageModel.getConversations(1)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('LEAST')
      expect(sql).toContain('GREATEST')
    })
  })

  describe('getThread', () => {
    it('retourne les messages d\'un fil de discussion', async () => {
      const thread = [
        { id: 1, content: 'Salut' },
        { id: 2, content: 'Bonjour !' },
      ]
      db.query.mockResolvedValue({ rows: thread })
      const result = await MessageModel.getThread(1, 2)
      expect(result).toEqual(thread)
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [2, 1])
    })

    it('filtre par listing_id et par participation de l\'utilisateur', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await MessageModel.getThread(1, 2)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('listing_id')
      expect(sql).toContain('sender_id')
      expect(sql).toContain('receiver_id')
    })
  })

  describe('markRead', () => {
    it('marque le message comme lu pour le destinataire', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await MessageModel.markRead(5, 3)
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE messages SET is_read = true'),
        [5, 3],
      )
    })

    it('vérifie que seul le destinataire peut marquer comme lu', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await MessageModel.markRead(5, 3)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('receiver_id = $2')
    })
  })

  describe('countUnread', () => {
    it('retourne le nombre de messages non lus comme un entier', async () => {
      db.query.mockResolvedValue({ rows: [{ count: '7' }] })
      const result = await MessageModel.countUnread(1)
      expect(result).toBe(7)
      expect(typeof result).toBe('number')
    })

    it('retourne 0 quand il n\'y a pas de messages non lus', async () => {
      db.query.mockResolvedValue({ rows: [{ count: '0' }] })
      const result = await MessageModel.countUnread(1)
      expect(result).toBe(0)
    })

    it('filtre sur receiver_id et is_read = false', async () => {
      db.query.mockResolvedValue({ rows: [{ count: '0' }] })
      await MessageModel.countUnread(1)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('receiver_id = $1')
      expect(sql).toContain('is_read = false')
    })
  })
})
