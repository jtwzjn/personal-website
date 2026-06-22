import type { Metadata } from 'next'
import { profile } from '@/content/profile'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/content/site.config'

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
      profile.social.twitter,
      profile.social.linkedin,
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">关于我</h1>
          <p className="text-muted-foreground text-xl">{profile.role}</p>
          <p className="max-w-2xl text-lg leading-relaxed">{profile.bio}</p>
        </section>

        <Separator className="my-12" />

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              技能栈
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              联系方式
            </h2>
            <ul className="text-muted-foreground space-y-2">
              <li>邮箱: {profile.email}</li>
              <li>地点: {profile.location}</li>
              <li>
                GitHub:{' '}
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  {profile.social.github}
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            工作经历
          </h2>
          <div className="grid gap-4">
            {profile.experiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{exp.role}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {exp.company} · {exp.period}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
