import { Pool } from '@neondatabase/serverless'

function getPool(): Pool | null {
  if (!process.env.POSTGRES_URL) {
    console.warn('POSTGRES_URL is not set. Database features will be unavailable.')
    return null
  }

  return new Pool({ connectionString: process.env.POSTGRES_URL })
}

const pool = getPool()

export async function query(text: string, params?: unknown[]) {
  if (!pool) {
    return { rows: [], rowCount: 0, command: text.split(' ')[0] } as const
  }

  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}
