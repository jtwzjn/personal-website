# CLAUDE.md

## Project Overview

**Name:** personal-website
**Domain:** https://jtwzjn.icu
**Repository:** https://github.com/jtwzjn/personal-website
**Platform:** Vercel (Hobby plan)
**Owner:** hcr
**Site Title:** 今天我在家呐

一个用于求职的个人品牌站点。定位是 **「面试官可验证的项目证据站」**：每一条 claim 都应该能被点开验证，优先服务于国央企 / 制造业 IT 方向的求职场景。

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui + 自定义毛玻璃（glass）设计系统 |
| 项目内容 | Markdown + YAML frontmatter（随代码走 Git） |
| 博客内容 | **Neon PostgreSQL**（在线可编辑，不随代码走） |
| 图片存储 | Vercel Blob |
| 后台鉴权 | NextAuth v5 + GitHub OAuth（管理员数字 ID 白名单） |
| Data | GitHub REST API（失败时优雅降级为纯文本卡片） |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Testing | Vitest（单元）+ Playwright（e2e，**目前无用例**） |
| Analytics | Vercel Analytics + Speed Insights |

> ⚠️ Sentry 的三个 `sentry.*.config.ts` 文件存在，但 `next.config.ts` **没有** `withSentryConfig`、没有 `instrumentation.ts`，CSP 的 `connect-src` 也未放行 Sentry —— **实际未接入**，属待清理项。

## Directory Structure

```
content/
  projects/              # 项目 Markdown（frontmatter 驱动页面）
scripts/
  init-db.sql            # 幂等数据库迁移（构建时自动执行）
  migrate.ts             # 执行 init-db.sql
  migrate-posts.ts       # 把 content/posts/*.md 导入数据库（历史遗留）
  generate-og-image.ps1  # 生成 public/images/og.png 分享图
src/
  app/
    page.tsx             # 首页（精选项目 + 技能 + 资料卡）
    about/               # 关于页
    projects/            # 项目列表 + 详情
    blog/                # 博客列表（栏目筛选）/ 详情 / 标签
    admin/               # 数据库驱动的博客后台（登录 + CRUD + 上传）
    api/auth/[...nextauth]/  # NextAuth 路由
    api/upload/          # Vercel Blob 图片上传（需登录）
    sitemap.ts           # 注意：带 revalidate，因为博客内容来自数据库
    robots.ts
    not-found.tsx
  components/            # UI 与布局组件
  content/               # site.config.ts / profile.ts（站点与个人资料）
  lib/                   # content loader、db、github、markdown 工具
  __tests__/             # 单元测试（目前仅一个 sanity 用例）
```

## 内容管理

### 项目（Markdown，随代码走）

`content/projects/*.md`，frontmatter 字段：

```yaml
---
title: '项目名'
slug: 'project-slug'
description: '一句话描述'
status: 'in-progress' # in-progress | completed | archived
progress: 100
githubRepo: 'user/repo'
githubRepoStatus: 'public' # public | pending | private（pending/private 不渲染死链）
featured: 1 # 精选排序，数字越小越靠前；不设置则排最后
tags: ['Python', 'Spark']
startedAt: '2026-01-10'
cover: '/images/projects/xxx.svg'
milestones:
  - title: '里程碑'
    date: '2026-01-16' # 可选，不确定就不要编
    completed: true
---
```

### 博客（数据库，不随代码走）

博客内容**不在仓库里**，存放在 Neon PostgreSQL 的 `posts` 表，通过 `/admin` 在线编辑。
表结构见 `scripts/init-db.sql`，字段包括 `slug / title / description / content / cover / tags / category / draft / published_at`。
`category` 用于「技术 / 日常」栏目筛选，博客列表默认只显示「技术」，日常随笔通过「全部 / 日常」标签仍可达。

> `content/posts/*.md` 是历史遗留的双轨来源，`pnpm build` 仍会执行 `migrate-posts.ts` 尝试导入。

## Development Workflow

```bash
cd D:/claude_desktop/personal-website
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # 会先跑数据库迁移，再 next build
pnpm run lint && pnpm run typecheck && pnpm run test
```

> 受限环境（沙箱）下 `pnpm test` 可能因 esbuild `spawn EPERM` 失败，这是环境限制而非项目问题。

## Deployment Workflow

1. 修改文件
2. `pnpm run lint && pnpm run typecheck && pnpm run build`
3. Commit 并 push 到 `main`
4. Vercel 自动构建部署（构建时自动执行幂等数据库迁移）

## Environment Variables

见 `.env.example`：

| Key | 是否必需 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 必需 | `https://jtwzjn.icu`，用于 metadata / robots / sitemap |
| `POSTGRES_URL` | 博客必需 | Neon 连接串；未设置时数据库查询返回空行 |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | 后台必需 | GitHub OAuth App |
| `ADMIN_GITHUB_ID` | 后台必需 | 允许登录的管理员 GitHub 数字 ID |
| `AUTH_SECRET` | 后台必需 | NextAuth 密钥 |
| `BLOB_READ_WRITE_TOKEN` | 上传必需 | Vercel Blob |
| `GITHUB_TOKEN` | 推荐 | 避免 GitHub API 限流 |

## 已知待办

### 高优先级
- [ ] 把两个主力项目的源码仓库开源并推送到 GitHub，然后把对应 `githubRepoStatus` 从 `'pending'` 改为 `'public'`
- [ ] 补充 `/resume` 在线简历页（信息收集表见被 gitignore 的 `RESUME_INTAKE.local.md`）
- [ ] 用真实项目截图替换三个 SVG 占位封面（社交分享图不支持 SVG）

### 工程债
- [ ] `e2e/` 目录为空，`.github/workflows/e2e.yml` 每周定时运行必然失败
- [ ] `src/__tests__/` 只有一个 `expect(true).toBe(true)`，CI 的 test job 实质空跑
- [ ] Sentry 要么真正接入（`withSentryConfig` + CSP 放行），要么删掉三个 config 文件
- [ ] 暗色模式 token 已定义但 `.dark` 从未挂载，没有切换开关
- [ ] 清理 `content/posts/*.md` 与 `migrate-posts.ts` 的历史遗留双轨

## Notes for Future Sessions

- 使用 `pnpm`，不要用 `npm`。
- 本地构建若报 `EXDEV: cross-device link not permitted`，是 telemetry 写 `%APPDATA%\nextjs-nodejs\Config` 导致；`dev` / `build` 脚本已设 `NEXT_TELEMETRY_DISABLED=1`。
- 不要提交 `.claude/`、`.env*`、`node_modules`、`.next`、`*.memory.md`、`*.local.md`。
- 站点标题保持 `今天我在家呐`，所有者保持 `hcr`，除非明确要求修改。
- **内容真实性红线**：项目页上的每一个数字都要能被原始材料（周进展报告、课程报告、论文）验证。历史上出现过「接口数量写成 10 余个（实际 8 个）」「返回时间写成 10 秒（实际 30–60 秒）」「项目页日期虚构（写成 2025 年，实际仓库 2026-06-22 建立）」等问题，均已修正。新增内容务必核对来源。
- 三个项目：本科毕业设计《基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统》、课程小组项目《加州高速公路事故时空可视分析系统》、本站。
- `scripts/generate-og-image.ps1` 修改分享图文案后需重新运行；Windows PowerShell 5.1 需要 UTF-8 **带 BOM** 才能正确读取中文字符串，且可能需 `Set-ExecutionPolicy -Scope Process Bypass`。
