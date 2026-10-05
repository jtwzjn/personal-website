import type { Metadata } from 'next'
import Link from 'next/link'
import { profile } from '@/content/profile'
import { resume } from '@/content/resume'
import { siteConfig } from '@/content/site.config'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Target,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '简历',
  description: `${resume.displayName} 的在线简历：教育背景、技能栈、项目经历与求职意向。`,
}

export default function ResumePage() {
  const { jobIntention, education, skillGroups, honors, experiences } = resume

  return (
    <div className="container-industrial py-16 sm:py-24">
      {/* 抬头 */}
      <section className="glass-strong rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="section-label">Resume</span>
              <h1 className="text-4xl font-bold tracking-tight">
                {resume.displayName}
              </h1>
              <p className="text-muted-foreground text-lg">{profile.role}</p>
            </div>
            <a
              href={`${siteConfig.links.email}?subject=${encodeURIComponent('简历索取 · 来自个人网站')}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
            >
              <Mail className="mr-2 h-4 w-4" />
              邮件索取完整简历
            </a>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a
              href={siteConfig.links.email}
              className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {jobIntention.cities.join(' / ')}
            </span>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {profile.social.github.replace('https://', '')}
            </a>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Target className="text-industrial h-4 w-4" />
              <span className="text-sm font-semibold">求职意向</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobIntention.roles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="bg-accent/60 px-3 py-1 text-sm font-medium"
                >
                  {role}
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm font-medium"
              >
                {jobIntention.availability}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              {jobIntention.note}
            </p>
          </div>
        </div>
      </section>

      {/* 教育背景 */}
      <section className="mt-10">
        <SectionTitle icon={GraduationCap} label="Education" title="教育背景" />
        <div className="mt-6 grid gap-4">
          {education.map((item) => (
            <Card key={item.school} className="glass-card border-0">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">
                      {item.school}
                      {item.college ? ` · ${item.college}` : ''}
                    </p>
                    <p className="text-muted-foreground">
                      {item.major} · {item.degree}
                    </p>
                  </div>
                  <span className="text-muted-foreground font-mono text-sm">
                    {item.period}
                  </span>
                </div>

                {item.gpa && (
                  <p className="text-muted-foreground mt-3 text-sm">
                    {item.gpa}
                  </p>
                )}

                {item.courses && item.courses.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.courses.map((course) => (
                      <Badge
                        key={course}
                        variant="secondary"
                        className="bg-accent/50 text-xs font-medium"
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 技能栈 */}
      <section className="mt-10">
        <SectionTitle icon={Sparkles} label="Skills" title="技能栈" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <Card key={group.label} className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {group.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="bg-accent/60 px-3 py-1 text-sm font-medium"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 项目经历 */}
      <section className="mt-10">
        <SectionTitle icon={Briefcase} label="Projects" title="主要项目经历" />
        <div className="mt-6 grid gap-5">
          {resume.projectHighlights.map((project) => (
            <Card key={project.slug} className="glass-card border-0">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-industrial text-lg font-semibold transition-colors"
                    >
                      {project.title}
                    </Link>
                    <p className="text-industrial text-sm font-medium">
                      {project.role}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {project.summary}
                </p>

                <ul className="mt-4 flex flex-col gap-2">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="text-muted-foreground flex gap-2 text-sm leading-relaxed"
                    >
                      <span className="text-industrial mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/projects/${project.slug}`}
                  className="text-industrial mt-4 inline-block text-sm font-medium hover:underline"
                >
                  查看项目详情 →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 实习 / 实践经历（无数据时自动省略） */}
      {experiences.length > 0 && (
        <section className="mt-10">
          <SectionTitle
            icon={Briefcase}
            label="Experience"
            title="实习 / 实践经历"
          />
          <div className="mt-6 grid gap-4">
            {experiences.map((item) => (
              <Card
                key={`${item.org}-${item.period}`}
                className="glass-card border-0"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold">{item.org}</p>
                      <p className="text-muted-foreground">{item.role}</p>
                    </div>
                    <span className="text-muted-foreground font-mono text-sm">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 奖项与荣誉（无数据时自动省略） */}
      {honors.length > 0 && (
        <section className="mt-10">
          <SectionTitle icon={Award} label="Honors" title="奖项与荣誉" />
          <Card className="glass-card mt-6 border-0">
            <CardContent className="pt-6">
              <ul className="flex flex-col gap-3">
                {honors.map((honor) => (
                  <li
                    key={honor.title}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-medium">{honor.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {[honor.level, honor.date].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      <p className="text-muted-foreground mt-10 text-sm">
        {resume.fullResumeNote}
      </p>
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  label,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="section-label">{label}</span>
      <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <Icon className="text-industrial h-5 w-5" />
        {title}
      </h2>
    </div>
  )
}
