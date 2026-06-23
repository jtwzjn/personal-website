import type { Metadata } from 'next'
import Image from 'next/image'
import { profile } from '@/content/profile'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/content/site.config'
import Link from 'next/link'
import { Github, Mail, MapPin, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: '关于',
  description: `了解更多关于 ${profile.name} 的信息、技能和经历。`,
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.bio,
    email: profile.email,
    url: siteConfig.url,
    sameAs: [
      profile.social.github,
      profile.social.bilibili,
      profile.social.linkedin,
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-industrial py-16 sm:py-24">
        <section className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-6">
            <div className="glass-strong rounded-3xl p-6">
              <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl bg-gradient-to-br from-industrial/20 to-industrial-muted/10 ring-1 ring-border sm:w-56"
              >
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="224px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-industrial"
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xl font-semibold">{profile.name}</p>
                <p className="text-muted-foreground mt-1">{profile.role}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </div>
              </div>

              <div className="industrial-line my-6" />

              <div className="grid grid-cols-2 gap-3">
                <SocialButton
                  href={profile.social.github}
                  icon={Github}
                  label="GitHub"
                />
                <SocialButton
                  href={siteConfig.links.bilibili}
                  icon={Globe}
                  label="Bilibili"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="section-label">About</span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                关于我
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                {profile.bio}
              </p>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                中国海洋大学在读学生，专注于数据可视化、全栈开发与 AI 应用。热衷于将复杂数据转化为清晰洞察，并通过现代 Web 技术落地为稳定、可扩展的产品。
              </p>
            </div>

            <Separator />

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">技能栈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-accent/60 px-3 py-1.5 text-sm font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">联系方式</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </a>
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    {profile.social.github}
                  </a>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-base">工作经历</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  暂无正式工作经历，项目经验请查看
                  <Link
                    href="/projects"
                    className="text-foreground hover:text-industrial font-medium underline-offset-4 transition-colors hover:underline"
                  >
                    项目页面
                  </Link>
                  。
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}

function SocialButton({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-accent/50 hover:bg-accent inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  )
}
