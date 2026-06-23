# CLAUDE.md

## Project Overview

**Name:** personal-website  
**Domain:** https://jtwzjn.icu  
**Repository:** https://github.com/jtwzjn/personal-website  
**Platform:** Vercel (Hobby plan)  
**Owner:** hcr  
**Site Title:** 今天我在家呐

A production-grade personal brand website. Publicly accessible, SEO-optimized, continuously deployed, and instrumented for observability.

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Content | Markdown with YAML frontmatter |
| Data | GitHub REST API (build-time, graceful fallback) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Testing | Vitest + Playwright |
| Analytics | Vercel Analytics + Speed Insights + Sentry (optional) |

## Directory Structure

```
content/
  projects/              # Project Markdown files
src/
  app/                   # Next.js App Router pages
  components/            # React components
  content/               # Site config and profile data
  lib/                   # Utilities, content loaders, GitHub client
  __tests__/             # Unit tests
.github/
  workflows/             # CI/CD pipelines
  dependabot.yml         # Dependency update automation
public/                  # Static assets
```

## Active Plan

### Completed
- [x] Project scaffold (Next.js + TypeScript + Tailwind + shadcn/ui)
- [x] Code quality tooling (ESLint, Prettier, Vitest, Playwright)
- [x] CI/CD with GitHub Actions
- [x] Home, About, Projects list, and Project detail pages
- [x] Markdown-based content system with milestones and progress
- [x] GitHub API integration with fallback behavior
- [x] SEO (sitemap.xml, robots.txt, JSON-LD, metadata)
- [x] Security headers (HSTS, CSP, X-Frame-Options, etc.)
- [x] Vercel Analytics + Speed Insights + Sentry wiring
- [x] Custom domain deployment (jtwzjn.icu)
- [x] Initial real content (profile + two resume projects)

### In Progress
- [ ] Add GitHub Token to Vercel for authenticated API calls
- [ ] Verify GitHub webhook auto-redeploy flow
- [ ] Add remaining project repositories to GitHub
- [ ] Populate real contact email
- [ ] Add project cover images to `/public/images/projects/`

### Backlog
- [ ] Add blog system (Markdown-based)
- [ ] Add dark mode toggle
- [ ] Migrate content to headless CMS when volume grows
- [ ] Add contact form with spam protection
- [ ] Add email subscription for updates
- [ ] Add Chinese/English i18n

## Development Workflow

```bash
cd D:/claude_desktop/personal-website
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Production build
pnpm run lint && pnpm run typecheck && pnpm run test
```

## Deployment Workflow

1. Edit files locally.
2. Run checks: `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build`
3. Commit and push to GitHub.
4. Vercel auto-deploys from `main`.
5. GitHub webhooks trigger redeploys on repository changes.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. In Vercel, set:

| Key | Status | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Required | `https://jtwzjn.icu` |
| `GITHUB_TOKEN` | Recommended | GitHub PAT with `public_repo` read permission |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry project DSN |
| `VERCEL_DEPLOY_HOOK_URL` | Optional | Used by GitHub webhooks |

## Content Management

Projects are defined in `content/projects/*.md` with YAML frontmatter:

```yaml
---
title: "Project Name"
slug: "project-slug"
description: "Short description"
status: "in-progress" # in-progress | completed | archived
progress: 75
githubRepo: "username/repo-name"
tags: ["React", "TypeScript"]
startedAt: "2025-06-01"
milestones:
  - title: "Milestone 1"
    date: "2025-06-15"
    completed: true
---
```

## Notes for Future Sessions

- Use `pnpm`, not `npm`.
- If local build fails with `EXDEV: cross-device link not permitted`, telemetry is writing to `%APPDATA%\nextjs-nodejs\Config`. The `dev` and `build` scripts set `NEXT_TELEMETRY_DISABLED=1` to avoid this.
- Do not commit `.claude/`, `.env*`, `node_modules`, `.next`, or `*.memory.md`.
- Keep the site title as "今天我在家呐" and owner name as "hcr" unless explicitly asked to change.
- The two primary projects are "基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统" and "加州高速公路事故时空可视分析系统".
