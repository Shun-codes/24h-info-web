import bcrypt from 'bcryptjs'
import pool from '../src/config/database.js'

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
