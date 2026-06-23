'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createPostAction } from '../actions'
import { PostFormFields } from '../_components/post-form-fields'

export default function NewPostPage() {
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    try {
      await createPostAction(formData)
    } catch (error) {
      setPending(false)
      alert(error instanceof Error ? error.message : '创建失败')
    }
  }

  return (
    <div className="container-industrial py-12 sm:py-20">
      <Link
        href="/admin/content/posts"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl">新建文章</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-6">
            <PostFormFields />

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
                创建文章
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
