import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/content/posts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowRight, Hash } from 'lucide-react'
import { formatDate } from '@/lib/date'

export const metadata: Metadata = {
  title: '博客',
  description: '分享技术思考、项目经验与学习笔记。',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div className="container-industrial py-16 sm:py-24">
      <section className="flex flex-col gap-4">
        <span className="section-label">Blog</span>
        <h1 className="text-4xl font-bold tracking-tight">博客</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          分享技术思考、项目经验与学习笔记。
        </p>
      </section>

      {tags.length > 0 && (
        <section className="mt-8">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                <Hash className="mr-1.5 inline h-4 w-4" />
                标签
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag} href={`/blog/tags/${tag}`}>
                    <Badge
                      variant="secondary"
                      className="bg-accent/60 hover:bg-accent px-3 py-1 text-sm font-medium transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mt-10">
        {posts.length === 0 ? (
          <Card className="glass-card border-0 p-8 text-center">
            <p className="text-muted-foreground">暂无文章，敬请期待。</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.frontmatter.slug}
                href={`/blog/${post.frontmatter.slug}`}
                className="group focus-visible:outline-none"
              >
                <Card className="glass-card border-0 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-industrial"
                      >
                        {post.frontmatter.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2 max-w-2xl"
                      >
                        {post.frontmatter.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground inline-flex items-center gap-1.5"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.frontmatter.publishedAt)}
                        </span>
                        <div className="flex flex-wrap gap-2"
                        >
                          {post.frontmatter.tags.slice(0, 4).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-accent/60 text-xs font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-industrial md:mt-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

