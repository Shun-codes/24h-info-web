import db from '../config/database.js'

export const ListingModel = {
  async findAll({ search, category, city, min_price, max_price, limit = 20, offset = 0 }) {
    const conditions = ['l.is_hidden = false', "l.expires_at > NOW()"]
    const params = []
    let i = 1

    if (search) {
      conditions.push(`(l.title ILIKE $${i} OR l.description ILIKE $${i})`)
      params.push(`%${search}%`)
      i++
    }
    if (category) {
      conditions.push(`c.slug = $${i}`)
      params.push(category)
      i++
    }
    if (city) {
      conditions.push(`l.city ILIKE $${i}`)
      params.push(`%${city}%`)
      i++
    }
    if (min_price !== undefined) { conditions.push(`l.price >= $${i}`); params.push(min_price); i++ }
    if (max_price !== undefined) { conditions.push(`l.price <= $${i}`); params.push(max_price); i++ }

    params.push(limit, offset)

    const { rows } = await db.query(
      `SELECT l.id, l.title, l.price, l.city, l.created_at, l.is_hidden,
              u.id AS seller_id, u.name AS seller_name,
              c.name AS category_name, c.slug AS category_slug,
              (SELECT url FROM listing_images WHERE listing_id = l.id ORDER BY position LIMIT 1) AS thumbnail
       FROM listings l
       JOIN users u ON u.id = l.user_id
       LEFT JOIN categories c ON c.id = l.category_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY l.created_at DESC
       LIMIT $${i} OFFSET $${i + 1}`,
      params,
    )
    return rows
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT l.*,
              u.id AS seller_id, u.name AS seller_name, u.phone AS seller_phone,
              u.avatar_url AS seller_avatar, u.city AS seller_city,
              c.name AS category_name, c.slug AS category_slug,
              COALESCE(
                json_agg(li.url ORDER BY li.position) FILTER (WHERE li.url IS NOT NULL),
                '[]'
              ) AS images
       FROM listings l
       JOIN users u ON u.id = l.user_id
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN listing_images li ON li.listing_id = l.id
       WHERE l.id = $1
       GROUP BY l.id, u.id, c.name, c.slug`,
      [id],
    )
    return rows[0] ?? null
  },

  async create({ user_id, category_id, title, description, price, city, contact_method }) {
    const { rows } = await db.query(
      `INSERT INTO listings (user_id, category_id, title, description, price, city, contact_method, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '90 days')
       RETURNING *`,
      [user_id, category_id, title, description, price, city, contact_method],
    )
    return rows[0]
  },

  async addImages(listingId, urls) {
    const values = urls.map((url, i) => `($1, $${i + 2}, ${i})`).join(', ')
    await db.query(
      `INSERT INTO listing_images (listing_id, url, position) VALUES ${values}`,
      [listingId, ...urls],
    )
  },

  async update(id, userId, fields) {
    const allowed = ['title', 'description', 'price', 'city', 'category_id', 'is_hidden']
    const sets = []
    const params = []
    let i = 1

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = $${i}`)
        params.push(fields[key])
        i++
      }
    }

    if (!sets.length) return null

    sets.push(`updated_at = NOW()`)
    params.push(id, userId)

    const { rows } = await db.query(
      `UPDATE listings SET ${sets.join(', ')} WHERE id = $${i} AND user_id = $${i + 1} RETURNING *`,
      params,
    )
    return rows[0] ?? null
  },

  async delete(id, userId) {
    const { rowCount } = await db.query(
      'DELETE FROM listings WHERE id = $1 AND user_id = $2',
      [id, userId],
    )
    return rowCount > 0
  },

  async findByUser(userId) {
    const { rows } = await db.query(
      `SELECT l.id, l.title, l.price, l.city, l.is_hidden, l.created_at, l.expires_at,
              c.name AS category_name,
              (SELECT url FROM listing_images WHERE listing_id = l.id ORDER BY position LIMIT 1) AS thumbnail
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       WHERE l.user_id = $1
       ORDER BY l.created_at DESC`,
      [userId],
    )
    return rows
  },

  async toggleFavorite(userId, listingId) {
    const { rows } = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND listing_id = $2',
      [userId, listingId],
    )
    if (rows.length) {
      await db.query('DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2', [userId, listingId])
      return { favorited: false }
    }
    await db.query('INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)', [userId, listingId])
    return { favorited: true }
  },

  async getFavorites(userId) {
    const { rows } = await db.query(
      `SELECT l.id, l.title, l.price, l.city, l.created_at,
              c.name AS category_name,
              (SELECT url FROM listing_images WHERE listing_id = l.id ORDER BY position LIMIT 1) AS thumbnail
       FROM listings l
       JOIN favorites f ON f.listing_id = l.id
       LEFT JOIN categories c ON c.id = l.category_id
       WHERE f.user_id = $1 AND l.is_hidden = false
       ORDER BY f.created_at DESC`,
      [userId],
    )
    return rows
  },

  async report(listingId, reporterId, { reason, description }) {
    await db.query(
      'INSERT INTO reports (listing_id, reporter_id, reason, description) VALUES ($1, $2, $3, $4)',
      [listingId, reporterId, reason, description],
    )
  },
}
