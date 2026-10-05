import Link from 'next/link'
import { ArrowLeft, FolderOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-industrial flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="section-label">404</span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        页面不存在
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md text-lg">
        你访问的页面可能已被移动或删除。不如先看看我的项目？
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/projects"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          查看项目
        </Link>
        <Link
          href="/"
          className="glass inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all hover:-translate-y-px"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  )
}
