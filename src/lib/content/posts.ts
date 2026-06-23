import { query } from '@/lib/db'

export interface PostFrontmatter {
  id: string
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  cover?: string
  draft: boolean
}

export interface Post {
  frontmatter: PostFrontmatter
  content: string
}

interface PostRow {
  id: string
  slug: string
  title: string
  description: string
  content: string
  cover: string | null
  tags: string[]
  draft: boolean
  published_at: string | null
  updated_at: string
  created_at: string
}

function mapRowToPost(row: PostRow): Post {
  return {
    frontmatter: {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      publishedAt: row.published_at ?? row.created_at,
      updatedAt: row.updated_at !== row.published_at ? row.updated_at : undefined,
      tags: row.tags ?? [],
      cover: row.cover ?? undefined,
      draft: row.draft,
    },
    content: row.content,
  }
}

export async function getAllPosts(includeDrafts = false): Promise<Post[]> {
  const result = await query(
    `SELECT * FROM posts
     WHERE ($1 = true OR draft = false)
     ORDER BY published_at DESC NULLS LAST, created_at DESC`,
    [includeDrafts]
  )

  return (result.rows as PostRow[]).map(mapRowToPost)
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<Post | null> {
  const result = await query(
    `SELECT * FROM posts
     WHERE slug = $1 AND ($2 = true OR draft = false)`,
    [slug, includeDrafts]
  )

  if (result.rows.length === 0) {
    return null
  }

  return mapRowToPost(result.rows[0] as PostRow)
}

export async function getAllPostSlugs(): Promise<string[]> {
  const result = await query(
    'SELECT slug FROM posts WHERE draft = false ORDER BY published_at DESC'
  )

  return result.rows.map((row) => (row as { slug: string }).slug)
}

export async function getPostMetaForSitemap(): Promise<{ slug: string; lastModified: Date }[]> {
  const result = await query(
    `SELECT slug, updated_at FROM posts WHERE draft = false ORDER BY published_at DESC`
  )

  return result.rows.map((row) => ({
    slug: (row as { slug: string }).slug,
    lastModified: new Date((row as { updated_at: string }).updated_at),
  }))
}

export async function getAllTags(): Promise<string[]> {
  const result = await query(
    `SELECT DISTINCT unnest(tags) AS tag FROM posts WHERE draft = false`
  )

  const tags = result.rows
    .map((row) => (row as { tag: string }).tag)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))

  return tags
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const result = await query(
    `SELECT * FROM posts
     WHERE draft = false AND $1 = ANY(tags)
     ORDER BY published_at DESC NULLS LAST`,
    [tag]
  )

  return (result.rows as PostRow[]).map(mapRowToPost)
}

export async function getPostsByYear(): Promise<Map<string, Post[]>> {
  const posts = await getAllPosts()
  const grouped = new Map<string, Post[]>()

  for (const post of posts) {
    const year = new Date(post.frontmatter.publishedAt).getFullYear().toString()
    const existing = grouped.get(year) ?? []
    existing.push(post)
    grouped.set(year, existing)
  }

  return grouped
}

export interface CreatePostInput {
  slug: string
  title: string
  description: string
  content: string
  cover?: string
  tags: string[]
  draft: boolean
  publishedAt?: string
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id?: string
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const result = await query(
    `INSERT INTO posts (slug, title, description, content, cover, tags, draft, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      input.slug,
      input.title,
      input.description,
      input.content,
      input.cover ?? null,
      input.tags,
      input.draft,
      input.publishedAt ?? null,
    ]
  )

  return mapRowToPost(result.rows[0] as PostRow)
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  const existing = await query('SELECT * FROM posts WHERE id = $1', [id])
  if (existing.rows.length === 0) {
    return null
  }

  const updates: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (input.slug !== undefined) {
    updates.push(`slug = $${paramIndex++}`)
    values.push(input.slug)
  }
  if (input.title !== undefined) {
    updates.push(`title = $${paramIndex++}`)
    values.push(input.title)
  }
  if (input.description !== undefined) {
    updates.push(`description = $${paramIndex++}`)
    values.push(input.description)
  }
  if (input.content !== undefined) {
    updates.push(`content = $${paramIndex++}`)
    values.push(input.content)
  }
  if (input.cover !== undefined) {
    updates.push(`cover = $${paramIndex++}`)
    values.push(input.cover ?? null)
  }
  if (input.tags !== undefined) {
    updates.push(`tags = $${paramIndex++}`)
    values.push(input.tags)
  }
  if (input.draft !== undefined) {
    updates.push(`draft = $${paramIndex++}`)
    values.push(input.draft)
  }
  if (input.publishedAt !== undefined) {
    updates.push(`published_at = $${paramIndex++}`)
    values.push(input.publishedAt ?? null)
  }

  updates.push(`updated_at = now()`)

  values.push(id)
  const result = await query(
    `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  )

  return mapRowToPost(result.rows[0] as PostRow)
}

export async function deletePost(id: string): Promise<boolean> {
  const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}

export async function getPostById(id: string): Promise<Post | null> {
  const result = await query('SELECT * FROM posts WHERE id = $1', [id])
  if (result.rows.length === 0) {
    return null
  }
  return mapRowToPost(result.rows[0] as PostRow)
}
