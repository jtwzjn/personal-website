export interface GitHubRepoData {
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  openIssues: number
  lastPushedAt: string
  createdAt: string
  updatedAt: string
  latestRelease?: {
    tagName: string
    publishedAt: string
    htmlUrl: string
  }
}

export async function fetchGitHubRepoData(
  repoFullName: string,
  token?: string
): Promise<GitHubRepoData | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const [repoResponse, releaseResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${repoFullName}`, {
        headers,
      }),
      fetch(`https://api.github.com/repos/${repoFullName}/releases/latest`, {
        headers,
      }).catch(() => null),
    ])

    if (!repoResponse.ok) {
      console.error(
        `GitHub API error for ${repoFullName}: ${repoResponse.status} ${repoResponse.statusText}`
      )
      return null
    }

    const repo = (await repoResponse.json()) as {
      name: string
      full_name: string
      description: string | null
      stargazers_count: number
      forks_count: number
      open_issues_count: number
      pushed_at: string
      created_at: string
      updated_at: string
    }

    let latestRelease: GitHubRepoData['latestRelease'] | undefined

    if (releaseResponse && releaseResponse.ok) {
      const release = (await releaseResponse.json()) as {
        tag_name: string
        published_at: string
        html_url: string
      }
      latestRelease = {
        tagName: release.tag_name,
        publishedAt: release.published_at,
        htmlUrl: release.html_url,
      }
    }

    return {
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      lastPushedAt: repo.pushed_at,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      latestRelease,
    }
  } catch (error) {
    console.error(`Failed to fetch GitHub data for ${repoFullName}:`, error)
    return null
  }
}

export function formatGitHubDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
