import { signIn } from '@/auth'
import { Github } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <div className="container-industrial flex min-h-[80vh] flex-col items-center justify-center">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">管理后台</h1>
            <p className="text-muted-foreground text-sm">
              仅管理员可访问，请使用 GitHub 账号登录。
            </p>
          </div>

          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/admin/content' })
            }}
          >
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm transition-all hover:-translate-y-px"
            >
              <Github className="h-5 w-5" />
              使用 GitHub 登录
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
