import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/content/projects'
import { markdownToHtml } from '@/lib/markdown'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Calendar, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/content/site.config'
import { fetchGitHubRepoData } from '@/lib/github'
import { GitHubRepoCard } from '@/components/github-repo-card'
import Link from 'next/link'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: '项目未找到',
    }
  }

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      url: `${siteConfig.url}/projects/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const contentHtml = await markdownToHtml(project.content)
  const githubData = project.frontmatter.githubRepo
    ? await fetchGitHubRepoData(
        project.frontmatter.githubRepo,
        process.env.GITHUB_TOKEN
      )
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.frontmatter.title,
    description: project.frontmatter.description,
    url: `${siteConfig.url}/projects/${slug}`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-industrial py-12 sm:py-20">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回项目列表
        </Link>

        <section className="flex flex-col gap-6">
          {project.frontmatter.cover && (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-muted">
              <Image
                src={project.frontmatter.cover}
                alt={project.frontmatter.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {project.frontmatter.title}
              </h1>
              <p className="text-muted-foreground max-w-3xl text-lg">
                {project.frontmatter.description}
              </p>
            </div>
            <StatusBadge status={project.frontmatter.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.frontmatter.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-accent/60 px-3 py-1 text-sm font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section className="glass-card mt-8 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">开发进度</span>
              {project.frontmatter.startedAt && (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  始于 {new Date(project.frontmatter.startedAt).getFullYear()}
                </span>
              )}
            </div>
            <span className="font-mono text-sm font-semibold">
              {project.frontmatter.progress}%
            </span>
          </div>
          <Progress value={project.frontmatter.progress} className="mt-3" />
        </section>

        <Separator className="my-12" />

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article
            className="prose prose-zinc max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <aside className="space-y-6">
            {githubData && <GitHubRepoCard data={githubData} />}

            {project.frontmatter.milestones &&
              project.frontmatter.milestones.length > 0 && (
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">里程碑</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.frontmatter.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {milestone.completed ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          {milestone.date && (
                            <p className="text-muted-foreground text-sm">
                              {milestone.date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            {project.frontmatter.githubRepo && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`https://github.com/${project.frontmatter.githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-industrial break-all font-mono text-sm transition-colors hover:underline"
                  >
                    {project.frontmatter.githubRepo}
                  </a>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}

function StatusBadge({
  status,
}: {
  status: 'in-progress' | 'completed' | 'archived'
}) {
  const labels = {
    'in-progress': '开发中',
    completed: '已完成',
    archived: '已归档',
  }

  const styles = {
    'in-progress': 'bg-industrial/90 text-white',
    completed: 'bg-emerald-500/90 text-white',
    archived: 'bg-slate-500/80 text-white',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
