import Link from 'next/link'
import { profile } from '@/content/profile'
import { getFeaturedProjects } from '@/lib/content/projects'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Github, Mail } from 'lucide-react'

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {profile.name}
          </h1>
          <p className="text-muted-foreground text-xl">{profile.role}</p>
          <p className="max-w-2xl text-lg leading-relaxed">{profile.bio}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              查看项目 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" /> 联系我
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={profile.social.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Bilibili"
          >
            B站
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">技能栈</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">精选项目</h2>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link
              key={project.frontmatter.slug}
              href={`/projects/${project.frontmatter.slug}`}
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle>{project.frontmatter.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {project.frontmatter.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">进度</span>
                      <span className="font-medium">
                        {project.frontmatter.progress}%
                      </span>
                    </div>
                    <Progress value={project.frontmatter.progress} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
