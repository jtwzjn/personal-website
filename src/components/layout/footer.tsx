import { siteConfig } from '@/content/site.config'

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="text-muted-foreground container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm md:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            B站
          </a>
        </div>
      </div>
    </footer>
  )
}
