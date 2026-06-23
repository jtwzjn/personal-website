import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProjects } from '@/lib/content/projects'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: '项目',
  description: '查看我参与和构建的项目，以及每个项目的开发进度。',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="container-industrial py-16 sm:py-24">
      <section className="flex flex-col gap-4">
        <span className="section-label">Portfolio</span>
        <h1 className="text-4xl font-bold tracking-tight">项目</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          我参与和构建的项目，以及实时开发进度。
        </p>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.frontmatter.slug}
            href={`/projects/${project.frontmatter.slug}`}
            className="group focus-visible:outline-none"
          >
            <Card className="glass-card h-full overflow-hidden border-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                {project.frontmatter.cover ? (
                  <Image
                    src={project.frontmatter.cover}
                    alt={project.frontmatter.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
                    <span className="text-muted-foreground text-2xl font-bold">
                      {project.frontmatter.title.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-4 right-4">
                  <StatusBadge status={project.frontmatter.status} />
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-lg">{project.frontmatter.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.frontmatter.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">开发进度</span>
                    <span className="font-mono font-medium">
                      {project.frontmatter.progress}%
                    </span>
                  </div>
                  <Progress value={project.frontmatter.progress} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {project.frontmatter.tags.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-accent/60 text-xs font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.frontmatter.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.frontmatter.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {project.frontmatter.startedAt
                      ? new Date(project.frontmatter.startedAt).getFullYear()
                      : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
