import { auth } from '@/auth'
import Link from 'next/link'
import { LayoutDashboard, FileText } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await auth()

  return (
    <div className="container-industrial py-16 sm:py-24">
      <section className="flex flex-col gap-4">
        <span className="section-label">Admin</span>
        <h1 className="text-4xl font-bold tracking-tight">管理后台</h1>
        <p className="text-muted-foreground text-lg">
          欢迎，{session?.user?.name ?? '管理员'}。
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/admin/content/posts">
          <div className="glass-card group rounded-2xl p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent"
            >
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">博客文章</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              创建、编辑和管理博客内容。
            </p>
          </div>
        </Link>

        <Link href="/">
          <div className="glass-card group rounded-2xl p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent"
            >
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">返回网站</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              返回前台首页。
            </p>
          </div>
        </Link>
      </section>
    </div>
  )
}
