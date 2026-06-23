import Link from 'next/link'
import { getAllPosts } from '@/lib/content/posts'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus, Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/date'
import { deletePostAction } from './actions'

export default async function AdminPostsPage() {
  const posts = await getAllPosts(true)

  return (
    <div className="container-industrial py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="section-label">Posts</span>
          <h1 className="text-4xl font-bold tracking-tight">博客文章</h1>
        </div>
        <Link href="/admin/content/posts/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-xl px-4">
            <Plus className="h-4 w-4" />
            新建文章
          </Button>
        </Link>
      </div>

      <section className="mt-10 grid gap-4">
        {posts.length === 0 ? (
          <Card className="glass-card border-0 p-8 text-center">
            <p className="text-muted-foreground">暂无文章，点击右上角新建。</p>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.frontmatter.id}
              className="glass-card border-0 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{post.frontmatter.title}</h2>
                    {post.frontmatter.draft && (
                      <Badge variant="outline">草稿</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {post.frontmatter.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.frontmatter.publishedAt)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-accent/60 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/content/posts/${post.frontmatter.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg"
                    >
                      <Pencil className="h-4 w-4" />
                      编辑
                    </Button>
                  </Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.frontmatter.id} />
                    <input type="hidden" name="slug" value={post.frontmatter.slug} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 inline-flex h-9 items-center gap-1.5 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  )
}
