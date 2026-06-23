import { query } from '../src/lib/db'
import fs from 'fs'
import path from 'path'

async function migrate() {
  const sqlPath = path.join(__dirname, 'init-db.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  await query(sql)
  console.log('Database migrated successfully')
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
