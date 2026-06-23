import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { query } from '../src/lib/db'

interface PostFrontmatter {
  title: string
  slug: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags?: string[]
  cover?: string
  draft?: boolean
}

async function migrate() {
  const postsDir = path.join(process.cwd(), 'content', 'posts')

  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found')
    return
  }

  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const contents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(contents)
    const frontmatter = data as PostFrontmatter

    if (!frontmatter.title || !frontmatter.slug || !frontmatter.description) {
      console.warn(`Skipping ${file}: missing required frontmatter`)
      continue
    }

    const existing = await query('SELECT id FROM posts WHERE slug = $1', [
      frontmatter.slug,
    ])

    if (existing.rows.length > 0) {
      console.log(`Post "${frontmatter.slug}" already exists, skipping`)
      continue
    }

    await query(
      `INSERT INTO posts (slug, title, description, content, cover, tags, draft, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        frontmatter.slug,
        frontmatter.title,
        frontmatter.description,
        content,
        frontmatter.cover ?? null,
        frontmatter.tags ?? [],
        frontmatter.draft ?? false,
        frontmatter.publishedAt ?? new Date().toISOString().split('T')[0],
      ]
    )

    console.log(`Migrated "${frontmatter.slug}"`)
  }
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
