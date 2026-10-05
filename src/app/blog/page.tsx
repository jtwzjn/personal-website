import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/content/posts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowRight, Hash } from 'lucide-react'
import { formatDate } from '@/lib/date'

export const metadata: Metadata = {
  title: '博客',
  description: '技术复盘、项目经验与日常记录。',
}

export const revalidate = 60

const ALL_CATEGORY = '全部'
const DEFAULT_VIEW_CATEGORY = '技术'

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category: categoryParam } = await searchParams

  // 默认只展示「技术」栏目，让访客先看到与岗位相关的内容；
  // 日常随笔通过「全部」或「日常」标签仍然完全可达。
  const activeCategory = categoryParam ?? DEFAULT_VIEW_CATEGORY
  const isAll = activeCategory === ALL_CATEGORY

  const [posts, tags, categories] = await Promise.all([
    getAllPosts(false, isAll ? undefined : activeCategory),
    getAllTags(),
    getAllCategories(),
  ])

  const total = categories.reduce((sum, item) => sum + item.count, 0)

  // 默认栏目始终要有入口：当数据库里还没有该栏目的文章时（例如本地未配置
  // POSTGRES_URL，或文章尚未创建），列表为空但仍应可选中，
  // 否则默认视图会出现「没有任何标签高亮」的困惑状态。
  const categoryTabs = categories.map((item) => ({
    label: item.category,
    value: item.category,
    count: item.count,
  }))

  if (!categoryTabs.some((tab) => tab.value === DEFAULT_VIEW_CATEGORY)) {
    categoryTabs.unshift({
      label: DEFAULT_VIEW_CATEGORY,
      value: DEFAULT_VIEW_CATEGORY,
      count: 0,
    })
  }

  const tabs = [
    ...categoryTabs,
    { label: ALL_CATEGORY, value: ALL_CATEGORY, count: total },
  ]

  return (
    <div className="container-industrial py-16 sm:py-24">
      <section className="flex flex-col gap-4">
        <span className="section-label">Blog</span>
        <h1 className="text-4xl font-bold tracking-tight">博客</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          技术复盘、项目经验与日常记录。
        </p>
      </section>

      <section className="mt-8">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="文章栏目"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === activeCategory
            const href =
              tab.value === DEFAULT_VIEW_CATEGORY
                ? '/blog'
                : `/blog?category=${encodeURIComponent(tab.value)}`

            return (
              <Link
                key={tab.value}
                href={href}
                role="tab"
                aria-selected={isActive}
                className={
                  isActive
                    ? 'bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors'
                    : 'glass text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors'
                }
              >
                {tab.label}
                <span className="font-mono text-xs opacity-70">
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {tags.length > 0 && (
        <section className="mt-6">
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
                  <Link
                    key={tag}
                    href={`/blog/tags/${encodeURIComponent(tag)}`}
                  >
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
            <p className="text-muted-foreground">
              该栏目下暂无文章，敬请期待。
            </p>
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
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-industrial/40 text-industrial text-xs font-medium"
                        >
                          {post.frontmatter.category}
                        </Badge>
                        <h2 className="group-hover:text-industrial text-xl font-semibold tracking-tight transition-colors">
                          {post.frontmatter.title}
                        </h2>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 max-w-2xl">
                        {post.frontmatter.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.frontmatter.publishedAt)}
                        </span>
                        <div className="flex flex-wrap gap-2">
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
                    <ArrowRight className="text-muted-foreground group-hover:text-industrial mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 md:mt-0" />
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
