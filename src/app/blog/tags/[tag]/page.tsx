import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostsByTag, getAllTags } from '@/lib/content/posts'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Calendar, ArrowLeft, Hash } from 'lucide-react'
import { formatDate } from '@/lib/date'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const posts = await getPostsByTag(tag)

  return {
    title: `标签：${tag}`,
    description: `查看与 "${tag}" 相关的 ${posts.length} 篇文章。`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const posts = await getPostsByTag(tag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container-industrial py-16 sm:py-24">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回博客列表
      </Link>

      <section className="flex flex-col gap-4">
        <span className="section-label">Tag</span>
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight"
        >
          <Hash className="text-muted-foreground h-8 w-8" />
          {tag}
        </h1>
        <p className="text-muted-foreground text-lg">
          共 {posts.length} 篇文章
        </p>
      </section>

      <section className="mt-10 grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.frontmatter.slug}
            href={`/blog/${post.frontmatter.slug}`}
            className="group focus-visible:outline-none"
          >
            <Card className="glass-card border-0 p-6">
              <div className="flex flex-col gap-2"
              >
                <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-industrial"
                >
                  {post.frontmatter.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2"
                >
                  {post.frontmatter.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm"
                >
                  <span className="text-muted-foreground inline-flex items-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.frontmatter.publishedAt)}
                  </span>
                  <div className="flex flex-wrap gap-2"
                  >
                    {post.frontmatter.tags.slice(0, 4).map((t) => (
                      <Badge
                        key={t}
                        variant={t === tag ? 'default' : 'secondary'}
                        className="px-3 py-1 text-xs font-medium"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}

