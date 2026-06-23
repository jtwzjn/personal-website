import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { getPostById } from '@/lib/content/posts'
import { updatePostAction } from '../../actions'
import { EditPostForm } from '../../_components/edit-post-form'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
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
          <CardTitle className="text-2xl">编辑文章</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPostForm post={post} action={updatePostAction} />
        </CardContent>
      </Card>
    </div>
  )
}
