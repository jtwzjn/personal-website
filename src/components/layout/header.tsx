import Link from 'next/link'
import { siteConfig } from '@/content/site.config'
import { Github } from 'lucide-react'

const navItems = [
  { href: '/about', label: '关于' },
  { href: '/projects', label: '项目' },
]

export function Header() {
  return (
    <header className="glass-strong sticky top-0 z-50 w-full border-b-0">
      <div className="container-industrial flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} 首页`}
        >
          <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
            {siteConfig.name.charAt(0)}
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
        </nav>
      </div>
    </header>
  )
}
