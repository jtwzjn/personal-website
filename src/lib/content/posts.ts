import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostFrontmatter {
  title: string
  slug: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  cover?: string
  draft?: boolean
}

export interface Post {
  frontmatter: PostFrontmatter
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function parsePost(fileName: string): Post {
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    frontmatter: data as PostFrontmatter,
    content,
  }
}

export function getAllPosts(includeDrafts = false): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map(parsePost)
    .filter((post) => includeDrafts || !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = a.frontmatter.publishedAt
        ? new Date(a.frontmatter.publishedAt).getTime()
        : 0
      const dateB = b.frontmatter.publishedAt
        ? new Date(b.frontmatter.publishedAt).getTime()
        : 0
      return dateB - dateA
    })

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts(true)
  const post = posts.find((post) => post.frontmatter.slug === slug)

  if (!post || post.frontmatter.draft) {
    return null
  }

  return post
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.frontmatter.slug)
}

export function getPostMetaForSitemap(): { slug: string; lastModified: Date }[] {
  return getAllPosts().map((post) => ({
    slug: post.frontmatter.slug,
    lastModified: new Date(
      post.frontmatter.updatedAt ?? post.frontmatter.publishedAt
    ),
  }))
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tagSet.add(tag)
    }
  }

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.tags.includes(tag))
}

export function getPostsByYear(): Map<string, Post[]> {
  const posts = getAllPosts()
  const grouped = new Map<string, Post[]>()

  for (const post of posts) {
    const year = new Date(post.frontmatter.publishedAt).getFullYear().toString()
    const existing = grouped.get(year) ?? []
    existing.push(post)
    grouped.set(year, existing)
  }

  return grouped
}
