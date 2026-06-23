'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import {
  createPost,
  updatePost,
  deletePost,
  CreatePostInput,
  UpdatePostInput,
} from '@/lib/content/posts'

async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

function parsePostFormData(formData: FormData): CreatePostInput {
  const slug = String(formData.get('slug') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const cover = String(formData.get('cover') ?? '').trim() || undefined
  const tagsString = String(formData.get('tags') ?? '').trim()
  const draft = formData.get('draft') === 'on'
  const publishedAt = String(formData.get('publishedAt') ?? '').trim() || undefined

  if (!slug || !title || !description || !content) {
    throw new Error('Slug, title, description and content are required')
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(slug)) {
    throw new Error('Slug must be lowercase letters, numbers, and hyphens only')
  }

  const tags = tagsString
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  return {
    slug,
    title,
    description,
    content,
    cover,
    tags,
    draft,
    publishedAt,
  }
}

function parseUpdateFormData(formData: FormData): UpdatePostInput {
  const input: UpdatePostInput = {}

  const slug = String(formData.get('slug') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const cover = String(formData.get('cover') ?? '').trim()
  const tagsString = String(formData.get('tags') ?? '').trim()
  const draft = formData.get('draft')
  const publishedAt = String(formData.get('publishedAt') ?? '').trim()

  if (slug) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      throw new Error('Slug must be lowercase letters, numbers, and hyphens only')
    }
    input.slug = slug
  }
  if (title) input.title = title
  if (description) input.description = description
  if (content) input.content = content
  input.cover = cover || undefined
  input.tags = tagsString
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
  input.draft = draft === 'on'
  input.publishedAt = publishedAt || undefined

  return input
}

export async function createPostAction(formData: FormData) {
  await requireAuth()

  const input = parsePostFormData(formData)
  const post = await createPost(input)

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.frontmatter.slug}`)
  redirect('/admin/content/posts')
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAuth()

  const input = parseUpdateFormData(formData)
  const post = await updatePost(id, input)

  if (!post) {
    throw new Error('Post not found')
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.frontmatter.slug}`)
  redirect('/admin/content/posts')
}

export async function deletePostAction(formData: FormData) {
  await requireAuth()

  const id = String(formData.get('id') ?? '')
  const slug = String(formData.get('slug') ?? '')

  if (!id) {
    throw new Error('Post ID is required')
  }

  const success = await deletePost(id)

  if (!success) {
    throw new Error('Post not found')
  }

  revalidatePath('/blog')
  if (slug) {
    revalidatePath(`/blog/${slug}`)
  }
}
