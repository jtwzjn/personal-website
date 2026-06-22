import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/content/projects'
import { markdownToHtml } from '@/lib/markdown'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import { siteConfig } from '@/content/site.config'
import { fetchGitHubRepoData } from '@/lib/github'
import { GitHubRepoCard } from '@/components/github-repo-card'

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
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {project.frontmatter.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-xl">
                {project.frontmatter.description}
              </p>
            </div>
            <StatusBadge status={project.frontmatter.status} />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">开发进度</span>
            <span className="font-medium">{project.frontmatter.progress}%</span>
          </div>
          <Progress value={project.frontmatter.progress} />
        </section>

        <Separator className="my-12" />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <aside className="space-y-6">
            {githubData && <GitHubRepoCard data={githubData} />}

            {project.frontmatter.milestones &&
              project.frontmatter.milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>里程碑</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.frontmatter.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {milestone.completed ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
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
              <Card>
                <CardHeader>
                  <CardTitle>GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`https://github.com/${project.frontmatter.githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
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

  const variants = {
    'in-progress': 'default',
    completed: 'secondary',
    archived: 'outline',
  } as const

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}
