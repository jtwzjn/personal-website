import { Github, Star, GitFork, AlertCircle, Clock, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitHubRepoData, formatGitHubDate } from '@/lib/github'

interface GitHubRepoCardProps {
  data: GitHubRepoData
}

export function GitHubRepoCard({ data }: GitHubRepoCardProps) {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Github className="h-5 w-5" />
          GitHub 数据
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatItem icon={Star} label="Stars" value={data.stars} />
          <StatItem icon={GitFork} label="Forks" value={data.forks} />
          <StatItem
            icon={AlertCircle}
            label="Open Issues"
            value={data.openIssues}
          />
          <StatItem
            icon={Clock}
            label="最后提交"
            value={formatGitHubDate(data.lastPushedAt)}
            isNumber={false}
          />
        </div>

        {data.latestRelease && (
          <div className="border-t border-border/50 pt-4">
            <p className="text-sm font-medium">最新发布</p>
            <a
              href={data.latestRelease.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Tag className="h-4 w-4" />
              {data.latestRelease.tagName}
              <span className="text-xs">
                ({formatGitHubDate(data.latestRelease.publishedAt)})
              </span>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
  isNumber = true,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  isNumber?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-muted-foreground mt-0.5 h-4 w-4" />
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className={isNumber ? 'font-mono font-medium' : 'font-medium'}>
          {typeof value === 'number' ? value.toLocaleString('zh-CN') : value}
        </p>
      </div>
    </div>
  )
}
