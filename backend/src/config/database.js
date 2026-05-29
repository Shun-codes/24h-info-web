import pg from 'pg'
import { config } from 'dotenv'

config()

const pool = new pg.Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'lunivert',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => console.error('DB pool error:', err))

export default pool
