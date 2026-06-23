'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { PostFormFields } from './post-form-fields'
import type { Post } from '@/lib/content/posts'

interface EditPostFormProps {
  post: Post
  action: (id: string, formData: FormData) => Promise<void>
}

export function EditPostForm({ post, action }: EditPostFormProps) {
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    try {
      await action(post.frontmatter.id, formData)
    } catch (error) {
      setPending(false)
      alert(error instanceof Error ? error.message : '保存失败')
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <PostFormFields
        defaultValues={{
          slug: post.frontmatter.slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          content: post.content,
          cover: post.frontmatter.cover,
          tags: post.frontmatter.tags.join(', '),
          draft: post.frontmatter.draft,
          publishedAt: post.frontmatter.publishedAt
            ? new Date(post.frontmatter.publishedAt).toISOString().split('T')[0]
            : '',
        }}
      />

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link href="/admin/content/posts">
          <Button type="button" variant="outline">取消</Button>
        </Link>
        <Button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          保存修改
        </Button>
      </div>
    </form>
  )
}
