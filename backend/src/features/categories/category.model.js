import db from '../../config/database.js'

export const CategoryModel = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT c.*,
              COUNT(l.id)::int AS listing_count
       FROM categories c
       LEFT JOIN listings l
         ON l.category_id = c.id
         AND l.is_hidden = false
         AND l.expires_at > NOW()
       GROUP BY c.id
       ORDER BY CASE WHEN c.slug = 'autres' THEN 1 ELSE 0 END, c.name`,
    )
    return rows
  },
}
