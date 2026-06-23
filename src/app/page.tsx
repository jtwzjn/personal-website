import Link from 'next/link'
import { profile } from '@/content/profile'
import { getFeaturedProjects } from '@/lib/content/projects'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Github, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3)

  return (
    <div className="flex flex-col">
      <section className="container-industrial relative flex flex-col justify-center gap-10 py-20 sm:py-28 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="flex max-w-2xl flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="section-label">{profile.role}</div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {profile.name}
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed sm:text-xl">
                {profile.bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
              >
                查看项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="glass inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all hover:-translate-y-px"
              >
                <Mail className="mr-2 h-4 w-4" />
                联系我
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={profile.social.bilibili}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Bilibili
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            </div>
          </div>

          <ProfileCard />
        </div>
      </section>

      <section className="container-industrial py-16">
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="section-label">Skills</span>
            <h2 className="text-2xl font-semibold tracking-tight">技能栈</h2>
          </div>
        </div>
        <div className="glass-card flex flex-wrap gap-2 rounded-2xl p-5">
          {profile.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1.5 text-sm font-medium"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="container-industrial pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="section-label">Featured Work</span>
            <h2 className="text-2xl font-semibold tracking-tight">精选项目</h2>
          </div>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
          >
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link
              key={project.frontmatter.slug}
              href={`/projects/${project.frontmatter.slug}`}
              className="group focus-visible:outline-none"
            >
              <Card className="glass-card h-full overflow-hidden border-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  {project.frontmatter.cover ? (
                    <Image
                      src={project.frontmatter.cover}
                      alt={project.frontmatter.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
                      <span className="text-muted-foreground text-2xl font-bold">
                        {project.frontmatter.title.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{project.frontmatter.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {project.frontmatter.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">进度</span>
                      <span className="font-mono font-medium">
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

function ProfileCard() {
  return (
    <div className="glass-strong relative rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-industrial/20 to-industrial-muted/10 ring-1 ring-border"
        >
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-industrial"
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1"
        >
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-muted-foreground text-sm">{profile.role}</p>
        </div>

        <div className="industrial-line w-full" />

        <div className="grid w-full grid-cols-2 gap-3"
        >
          <Stat label="项目" value="3+" />
          <Stat label="状态" value="活跃" />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-accent/40 rounded-xl px-3 py-3"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
