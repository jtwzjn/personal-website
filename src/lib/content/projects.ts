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
