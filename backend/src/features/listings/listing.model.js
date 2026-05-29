import db from '../../config/database.js'

export const ListingModel = {
  /**
   * Récupère la liste paginée des annonces avec filtres dynamiques.
   *
   * Construction des clauses WHERE à la volée avec un compteur `i` pour
   * maintenir l'ordre des paramètres positionnels PostgreSQL ($1, $2…).
   * Les filtres texte (search, city) utilisent ILIKE (insensible à la casse).
   *
   * @param {object} opts
   * @param {string}  [opts.search]     - Recherche dans titre OU description
   * @param {string}  [opts.category]   - Slug de catégorie
   * @param {string}  [opts.city]       - Ville (recherche partielle)
   * @param {number}  [opts.min_price]
   * @param {number}  [opts.max_price]
   * @param {number}  [opts.limit=20]   - Max 100 (plafonné dans le contrôleur)
   * @param {number}  [opts.offset=0]
   * @returns {Promise<object[]>}
   */
  async findAll({ search, category, city, min_price, max_price, limit = 20, offset = 0 }) {
    const conditions = ['l.is_hidden = false', "l.expires_at > NOW()"]
    const params = []
    let i = 1

    if (search) {
      // Même paramètre $i réutilisé pour le titre ET la description
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

    // LIMIT et OFFSET sont toujours les deux derniers paramètres
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

  /**
   * Récupère le détail complet d'une annonce, avec toutes ses images et
   * les infos du vendeur.
   *
   * `is_favorited` : le CASE WHEN gère le cas userId=null en SQL pour éviter
   * une requête séparée côté JS. Passer NULL évite une erreur de type sur
   * la sous-requête EXISTS.
   *
   * `json_agg … FILTER (WHERE li.url IS NOT NULL)` évite qu'un LEFT JOIN sans
   * image ne produise `[null]` au lieu de `[]`.
   *
   * @param {number}      id
   * @param {number|null} userId - null pour les visiteurs anonymes
   * @returns {Promise<object|null>}
   */
  async findById(id, userId = null) {
    const { rows } = await db.query(
      `SELECT l.*,
              u.id AS seller_id, u.name AS seller_name, u.phone AS seller_phone,
              u.avatar_url AS seller_avatar, u.city AS seller_city,
              c.name AS category_name, c.slug AS category_slug,
              COALESCE(
                json_agg(li.url ORDER BY li.position) FILTER (WHERE li.url IS NOT NULL),
                '[]'
              ) AS images,
              CASE WHEN $2::integer IS NULL THEN false
                   ELSE EXISTS(
                     SELECT 1 FROM favorites f
                     WHERE f.listing_id = l.id AND f.user_id = $2
                   )
              END AS is_favorited
       FROM listings l
       JOIN users u ON u.id = l.user_id
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN listing_images li ON li.listing_id = l.id
       WHERE l.id = $1
       GROUP BY l.id, u.id, c.name, c.slug`,
      [id, userId],
    )
    return rows[0] ?? null
  },

  /**
   * Crée une annonce. La date d'expiration est fixée à 90 jours en base
   * pour éviter les décalages horaires liés au calcul côté application.
   */
  async create({ user_id, category_id, title, description, price, city, contact_method }) {
    const { rows } = await db.query(
      `INSERT INTO listings (user_id, category_id, title, description, price, city, contact_method, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '90 days')
       RETURNING *`,
      [user_id, category_id, title, description, price, city, contact_method],
    )
    return rows[0]
  },

  /**
   * Insère les images associées à une annonce en une seule requête multi-VALUES.
   * La position correspond à l'index dans le tableau (ordre d'upload).
   *
   * @param {number}   listingId
   * @param {string[]} urls - Chemins relatifs des fichiers (/uploads/uuid.ext)
   */
  async addImages(listingId, urls) {
    const values = urls.map((url, i) => `($1, $${i + 2}, ${i})`).join(', ')
    await db.query(
      `INSERT INTO listing_images (listing_id, url, position) VALUES ${values}`,
      [listingId, ...urls],
    )
  },

  /**
   * Mise à jour partielle d'une annonce (PATCH sémantique via PUT).
   * Seuls les champs de la whitelist `allowed` peuvent être modifiés.
   * La clause `AND user_id = $n` garantit que seul le propriétaire peut
   * modifier — pas besoin de vérification applicative séparée.
   *
   * @param {number} id
   * @param {number} userId - Propriétaire attendu
   * @param {object} fields - Champs à mettre à jour
   * @returns {Promise<object|null>} null si annonce introuvable ou non propriétaire
   */
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

  /**
   * Bascule l'état favori d'une annonce pour un utilisateur (ajout/suppression).
   * Utilise un SELECT préalable plutôt qu'un INSERT ON CONFLICT pour pouvoir
   * distinguer l'ajout de la suppression et renvoyer l'état résultant.
   *
   * @returns {Promise<{ favorited: boolean }>}
   */
  async toggleFavorite(userId, listingId) {
    const { rows } = await db.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND listing_id = $2',
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
              u.name AS seller_name,
              c.name AS category_name, c.slug AS category_slug,
              (SELECT url FROM listing_images WHERE listing_id = l.id ORDER BY position LIMIT 1) AS thumbnail
       FROM listings l
       JOIN favorites f ON f.listing_id = l.id
       JOIN users u ON u.id = l.user_id
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
