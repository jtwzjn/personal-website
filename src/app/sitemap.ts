import type { MetadataRoute } from 'next'
import { siteConfig } from '@/content/site.config'
import { getAllProjectSlugs } from '@/lib/content/projects'
import { getAllTags, getPostMetaForSitemap } from '@/lib/content/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectSlugs = getAllProjectSlugs()
  const tags = getAllTags()

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${siteConfig.url}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = getPostMetaForSitemap().map(
    ({ slug, lastModified }) => ({
      url: `${siteConfig.url}/blog/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteConfig.url}/blog/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...routes, ...projectRoutes, ...postRoutes, ...tagRoutes]
}
