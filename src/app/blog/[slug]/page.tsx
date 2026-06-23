import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/content/posts'
import { markdownToHtml } from '@/lib/markdown'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import { formatDate } from '@/lib/date'
import { siteConfig } from '@/content/site.config'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true
export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${siteConfig.url}/blog/${slug}`,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: post.frontmatter.publishedAt,
    dateModified: post.frontmatter.updatedAt ?? post.frontmatter.publishedAt,
    author: {
      '@type': 'Person',
      name: 'hcr',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-industrial py-12 sm:py-20">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回博客列表
        </Link>

        <article className="mx-auto max-w-3xl">
          <header className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.frontmatter.publishedAt)}
              </span>
              {post.frontmatter.updatedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  更新于 {formatDate(post.frontmatter.updatedAt)}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.frontmatter.title}
            </h1>

            <p className="text-muted-foreground text-lg">
              {post.frontmatter.description}
            </p>

            {post.frontmatter.cover && (
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-muted"
              >
                <Image
                  src={post.frontmatter.cover}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <Link key={tag} href={`/blog/tags/${tag}`}>
                    <Badge
                      variant="secondary"
                      className="bg-accent/60 px-3 py-1 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <Separator className="my-10" />

          <Card className="glass-card border-0">
            <CardContent className="py-8">
              <div
                className="prose prose-zinc max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </CardContent>
          </Card>
        </article>
      </div>
    </>
  )
}

