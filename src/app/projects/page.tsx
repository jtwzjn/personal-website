import type { Metadata } from 'next'
import Link from 'next/link'
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

export const metadata: Metadata = {
  title: '项目',
  description: '查看我参与和构建的项目，以及每个项目的开发进度。',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">项目</h1>
        <p className="text-muted-foreground text-xl">
          我参与和构建的项目，以及实时开发进度。
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.frontmatter.slug}
            href={`/projects/${project.frontmatter.slug}`}
          >
            <Card className="hover:bg-muted/50 h-full transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{project.frontmatter.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.frontmatter.description}
                    </CardDescription>
                  </div>
                  <StatusBadge status={project.frontmatter.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">进度</span>
                    <span className="font-medium">
                      {project.frontmatter.progress}%
                    </span>
                  </div>
                  <Progress value={project.frontmatter.progress} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
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

  const variants = {
    'in-progress': 'default',
    completed: 'secondary',
    archived: 'outline',
  } as const

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}
