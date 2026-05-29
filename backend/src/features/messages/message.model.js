import db from '../../config/database.js'

export const MessageModel = {
  /** Enregistre un message et retourne la ligne créée. */
  async send({ listing_id, sender_id, receiver_id, content }) {
    const { rows } = await db.query(
      `INSERT INTO messages (listing_id, sender_id, receiver_id, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [listing_id, sender_id, receiver_id, content],
    )
    return rows[0]
  },

  /**
   * Retourne la liste des conversations de l'utilisateur, dédupliquées.
   *
   * Stratégie de déduplication :
   * Une "conversation" = un couple (participants, annonce).
   * La clé `conv_key` est construite avec LEAST/GREATEST sur les deux IDs pour
   * qu'elle soit identique quelle que soit la direction du message
   * (ex. : "3-7-42" = même clé pour sender=3,receiver=7 et sender=7,receiver=3).
   * `DISTINCT ON (conv_key)` combiné à `ORDER BY conv_key, created_at DESC`
   * garde uniquement le message le plus récent par conversation.
   */
  async getConversations(userId) {
    const { rows } = await db.query(
      `SELECT DISTINCT ON (conv_key)
              m.id, m.listing_id, m.content, m.is_read, m.created_at,
              l.title AS listing_title,
              CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
              CASE WHEN m.sender_id = $1 THEN ru.name ELSE su.name END AS other_user_name,
              CASE WHEN m.sender_id = $1 THEN ru.avatar_url ELSE su.avatar_url END AS other_user_avatar
       FROM (
         SELECT *, CONCAT(LEAST(sender_id, receiver_id), '-', GREATEST(sender_id, receiver_id), '-', listing_id) AS conv_key
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1
       ) m
       JOIN listings l ON l.id = m.listing_id
       JOIN users su ON su.id = m.sender_id
       JOIN users ru ON ru.id = m.receiver_id
       ORDER BY conv_key, m.created_at DESC`,
      [userId],
    )
    return rows
  },

  async getThread(userId, listingId) {
    const { rows } = await db.query(
      `SELECT m.id, m.content, m.is_read, m.created_at,
              m.sender_id, u.name AS sender_name, u.avatar_url AS sender_avatar
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.listing_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2)
       ORDER BY m.created_at ASC`,
      [listingId, userId],
    )
    return rows
  },

  async markRead(messageId, userId) {
    await db.query(
      'UPDATE messages SET is_read = true WHERE id = $1 AND receiver_id = $2',
      [messageId, userId],
    )
  },

  async countUnread(userId) {
    const { rows } = await db.query(
      'SELECT COUNT(*) FROM messages WHERE receiver_id = $1 AND is_read = false',
      [userId],
    )
    return parseInt(rows[0].count, 10)
  },
}
