// @vitest-environment node
// 本测试直接读取 content/ 与 public/ 目录（依赖 fs / path），
// 必须运行在 node 环境；vitest 全局默认是 jsdom，会把这两者外部化。
import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

import {
  getAllProjects,
  getAllProjectSlugs,
  getFeaturedProjects,
  getProjectBySlug,
} from '@/lib/content/projects'
import { resume } from '@/content/resume'
import { siteConfig } from '@/content/site.config'

const ALLOWED_STATUS = ['in-progress', 'completed', 'archived']
const ALLOWED_REPO_STATUS = ['public', 'pending', 'private']

/** 把站点内的绝对路径（形如 /images/x.png）映射到 public 目录下的真实文件路径 */
function publicFile(webPath: string): string {
  return path.join(process.cwd(), 'public', webPath.replace(/^\//, ''))
}

describe('项目内容：加载', () => {
  it('至少能加载到一个项目', () => {
    expect(getAllProjects().length).toBeGreaterThan(0)
  })

  it('未知 slug 返回 null，而不是抛错', () => {
    expect(getProjectBySlug('this-slug-does-not-exist')).toBeNull()
  })

  it('getAllProjectSlugs 与 getAllProjects 一致', () => {
    expect(getAllProjectSlugs()).toEqual(
      getAllProjects().map((p) => p.frontmatter.slug)
    )
  })
})

describe('项目内容：frontmatter 完整性', () => {
  const projects = getAllProjects()

  it.each(projects.map((p) => [p.frontmatter.slug, p] as const))(
    '%s 的必填字段完整且合法',
    (_slug, project) => {
      const f = project.frontmatter

      expect(f.title, 'title 不能为空').toBeTruthy()
      expect(f.slug, 'slug 不能为空').toBeTruthy()
      expect(f.description, 'description 不能为空').toBeTruthy()

      expect(ALLOWED_STATUS).toContain(f.status)
      expect(f.progress).toBeGreaterThanOrEqual(0)
      expect(f.progress).toBeLessThanOrEqual(100)

      expect(Array.isArray(f.tags)).toBe(true)
      expect(f.tags.length).toBeGreaterThan(0)

      if (f.githubRepoStatus) {
        expect(ALLOWED_REPO_STATUS).toContain(f.githubRepoStatus)
      }

      // githubRepo 必须形如 owner/repo，否则页面拼出的链接会是坏的
      if (f.githubRepo) {
        expect(f.githubRepo).toMatch(/^[\w.-]+\/[\w.-]+$/)
      }

      // 起始日期必须是可解析的日期
      if (f.startedAt) {
        expect(Number.isNaN(new Date(f.startedAt).getTime())).toBe(false)
      }
    }
  )

  it('slug 唯一', () => {
    const slugs = projects.map((p) => p.frontmatter.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('featured 排序权重不重复', () => {
    const featured = projects
      .map((p) => p.frontmatter.featured)
      .filter((n): n is number => typeof n === 'number')
    expect(new Set(featured).size).toBe(featured.length)
  })

  it('每个里程碑都有标题与完成状态', () => {
    for (const project of projects) {
      for (const milestone of project.frontmatter.milestones ?? []) {
        expect(
          milestone.title,
          `${project.frontmatter.slug} 的里程碑缺少标题`
        ).toBeTruthy()
        expect(typeof milestone.completed).toBe('boolean')
      }
    }
  })

  it('正文内容非空', () => {
    for (const project of projects) {
      expect(
        project.content.trim().length,
        `${project.frontmatter.slug} 正文为空`
      ).toBeGreaterThan(0)
    }
  })
})

describe('项目内容：静态资源引用真实存在', () => {
  it('每个项目封面文件都存在于 public 目录', () => {
    for (const project of getAllProjects()) {
      const cover = project.frontmatter.cover
      if (!cover) continue
      expect(fs.existsSync(publicFile(cover)), `封面不存在: ${cover}`).toBe(
        true
      )
    }
  })

  it('项目正文中引用的图片都存在于 public 目录', () => {
    const imageRe = /!\[[^\]]*\]\((\/[^)\s]+)\)/g
    for (const project of getAllProjects()) {
      for (const match of project.content.matchAll(imageRe)) {
        const src = match[1]
        expect(
          fs.existsSync(publicFile(src)),
          `正文图片不存在: ${src}（项目 ${project.frontmatter.slug}）`
        ).toBe(true)
      }
    }
  })

  it('站点分享图 ogImage 存在', () => {
    expect(
      fs.existsSync(publicFile(siteConfig.ogImage)),
      `ogImage 不存在: ${siteConfig.ogImage}`
    ).toBe(true)
  })
})

describe('项目内容：排序策略', () => {
  it('按 featured 升序排列，未设置 featured 的排在最后', () => {
    const projects = getAllProjects()
    const featuredValues = projects.map(
      (p) => p.frontmatter.featured ?? Number.MAX_SAFE_INTEGER
    )
    const sorted = [...featuredValues].sort((a, b) => a - b)
    expect(featuredValues).toEqual(sorted)
  })

  it('毕业设计置顶（首页第一屏展示最强的项目）', () => {
    const first = getFeaturedProjects(1)[0]
    expect(first.frontmatter.slug).toBe('bilibili-video-analysis')
  })

  it('getFeaturedProjects 遵守 limit', () => {
    expect(getFeaturedProjects(2)).toHaveLength(2)
    expect(getFeaturedProjects(0)).toHaveLength(0)
  })
})

describe('简历页数据一致性', () => {
  it('简历引用的每个项目 slug 都真实存在', () => {
    const slugs = new Set(getAllProjectSlugs())
    for (const item of resume.projectHighlights) {
      expect(slugs.has(item.slug), `简历引用了不存在的项目: ${item.slug}`).toBe(
        true
      )
    }
  })

  it('简历不含手机号等隐私字段', () => {
    const text = JSON.stringify(resume)
    // 中国大陆手机号
    expect(text).not.toMatch(/(?<!\d)1[3-9]\d{9}(?!\d)/)
    // 身份证号
    expect(text).not.toMatch(/(?<!\d)\d{17}[\dXx](?!\d)/)
  })
})
