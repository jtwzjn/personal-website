import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ProjectFrontmatter {
  title: string
  slug: string
  description: string
  status: 'in-progress' | 'completed' | 'archived'
  progress: number
  githubRepo?: string
  /**
   * 仓库可见性。默认为 'public'，此时页面直接渲染可点击的仓库链接。
   * 'pending' 表示代码仍在整理、尚未开源，'private' 表示仓库不公开，
   * 两种情况都不会渲染成死链，而是给出诚实的说明文案。
   */
  githubRepoStatus?: 'public' | 'pending' | 'private'
  /**
   * 精选排序权重，数字越小越靠前。用于让面试官第一眼看到最有力的项目，
   * 而不是被"最近更新"的元项目（本站自身）占据首位。未设置时排在最后。
   */
  featured?: number
  tags: string[]
  startedAt?: string
  cover?: string
  milestones?: Milestone[]
}

export interface Milestone {
  title: string
  date?: string
  completed: boolean
}

export interface Project {
  frontmatter: ProjectFrontmatter
  content: string
}

const projectsDirectory = path.join(process.cwd(), 'content', 'projects')

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)
  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        frontmatter: data as ProjectFrontmatter,
        content,
      }
    })
    .sort((a, b) => {
      const featuredA = a.frontmatter.featured ?? Number.MAX_SAFE_INTEGER
      const featuredB = b.frontmatter.featured ?? Number.MAX_SAFE_INTEGER
      if (featuredA !== featuredB) {
        return featuredA - featuredB
      }

      const dateA = a.frontmatter.startedAt
        ? new Date(a.frontmatter.startedAt).getTime()
        : 0
      const dateB = b.frontmatter.startedAt
        ? new Date(b.frontmatter.startedAt).getTime()
        : 0
      return dateB - dateA
    })

  return projects
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects()
  return projects.find((project) => project.frontmatter.slug === slug) ?? null
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.frontmatter.slug)
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects().slice(0, limit)
}
