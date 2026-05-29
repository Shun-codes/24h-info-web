import db from '../config/database.js'

export const UserModel = {
  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, email, name, phone, city, role, avatar_url, created_at FROM users WHERE id = $1',
      [id],
    )
    return rows[0] ?? null
  },

  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])
    return rows[0] ?? null
  },

  async create({ email, password, name, phone, city }) {
    const { rows } = await db.query(
      `INSERT INTO users (email, password, name, phone, city)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, phone, city, role, created_at`,
      [email, password, name, phone, city],
    )
    return rows[0]
  },

  async update(id, { email, name, phone, city, avatar_url }) {
    const { rows } = await db.query(
      `UPDATE users
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           phone = COALESCE($3, phone),
           city = COALESCE($4, city),
           avatar_url = COALESCE($5, avatar_url),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, name, phone, city, role, avatar_url`,
      [email, name, phone, city, avatar_url, id],
    )
    return rows[0] ?? null
  },

  async updatePassword(id, hashedPassword) {
    await db.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, id])
  },

  async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id])
  },
}
