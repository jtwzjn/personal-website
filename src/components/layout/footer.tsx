import { siteConfig } from '@/content/site.config'
import { Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container-industrial flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row"
      >
        <p className="font-medium">
          © {currentYear} {siteConfig.name}
        </p>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href={siteConfig.links.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Bilibili
          </a>
        </div>
      </div>
    </footer>
  )
}
