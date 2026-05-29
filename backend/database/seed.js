import bcrypt from 'bcryptjs'
import pg from 'pg'
import { config } from 'dotenv'

config()

const pool = new pg.Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'lunivert',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'lunivert_dev',
})

const ACCOUNTS = [
  { email: 'user@lunivert.fr',  password: 'User1234',  name: 'Jean Utilisateur', role: 'user',      city: 'Lyon' },
  { email: 'modo@lunivert.fr',  password: 'Modo1234',  name: 'Marie Modératrice', role: 'moderator', city: 'Paris' },
  { email: 'admin@lunivert.fr', password: 'Admin1234', name: 'Pierre Admin',      role: 'admin',     city: 'Lens' },
]

async function seed() {
  for (const account of ACCOUNTS) {
    const hashed = await bcrypt.hash(account.password, 12)
    await pool.query(
      `INSERT INTO users (email, password, name, role, city)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [account.email, hashed, account.name, account.role, account.city],
    )
    console.log(`✓ ${account.role.padEnd(10)} ${account.email}  /  ${account.password}`)
  }
  console.log('\nSeed terminé.')
  await pool.end()
}

seed().catch((err) => {
  console.error('Erreur seed :', err.message)
  process.exit(1)
})
