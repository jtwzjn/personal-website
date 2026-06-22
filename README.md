# Personal Website

A production-grade personal brand website built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Personal profile**: Home and about pages
- **Project showcase**: Project list and detail pages with development progress
- **GitHub integration**: Automatic repo data fetching with graceful fallback
- **SEO optimized**: Sitemap, robots.txt, JSON-LD structured data
- **Performance monitoring**: Vercel Analytics, Speed Insights, Sentry
- **CI/CD**: GitHub Actions with lint, format, type check, tests, and build
- **Security headers**: HSTS, CSP, X-Frame-Options, and more

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run production build

```bash
pnpm build
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
GITHUB_TOKEN=          # GitHub personal access token (public_repo read permission)
GITHUB_USERNAME=       # Your GitHub username
VERCEL_DEPLOY_HOOK_URL=# Vercel deploy hook for GitHub webhook
NEXT_PUBLIC_SENTRY_DSN=# Sentry DSN (optional)
```

## Content Management

Projects are managed as Markdown files in `content/projects/`. Each file has YAML frontmatter:

```yaml
---
title: 'Project Name'
slug: 'project-slug'
description: 'Short description'
status: 'in-progress' # in-progress | completed | archived
progress: 75
githubRepo: 'username/repo-name'
tags: ['React', 'TypeScript']
startedAt: '2025-06-01'
milestones:
  - title: 'Milestone 1'
    date: '2025-06-15'
    completed: true
---
```

## Deployment

### Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel project settings
4. Add Vercel Deploy Hook URL to GitHub webhooks for automatic redeploys

### GitHub Webhook Setup

1. Go to your GitHub repo → Settings → Webhooks → Add webhook
2. Payload URL: your Vercel Deploy Hook URL
3. Content type: `application/json`
4. Events: Push, Release

## License

MIT
