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

| Layer     | Technology                                                       |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 16 App Router + React 19 + TypeScript                    |
| Styling   | Tailwind CSS 4 + shadcn/ui + 自定义毛玻璃（glass）设计系统       |
| 主题      | 深浅色切换（`.dark` 类 + localStorage，首屏阻塞脚本防闪烁）      |
| 项目内容  | Markdown + YAML frontmatter（随代码走 Git）                      |
| 博客内容  | **Neon PostgreSQL**（在线可编辑，不随代码走）                    |
| Markdown  | unified + remark-parse/gfm + remark-rehype + **rehype-sanitize** |
| 图片存储  | Vercel Blob                                                      |
| 后台鉴权  | NextAuth v5 + GitHub OAuth（管理员数字 ID 白名单）               |
| Data      | GitHub REST API（失败时优雅降级为纯文本卡片）                    |
| Hosting   | Vercel                                                           |
| CI/CD     | GitHub Actions（lint / format / typecheck / unit / build）       |
| Testing   | Vitest（38 个单元用例）+ Playwright（18 个 e2e 用例）            |
| Analytics | Vercel Analytics + Speed Insights                                |

## Directory Structure

```
content/
  projects/              # 项目 Markdown（frontmatter 驱动页面）
  posts/                 # 博客种子 Markdown（构建时导入数据库）
scripts/
  init-db.sql            # 幂等数据库迁移（构建时自动执行）
  migrate.ts             # 执行 init-db.sql
  migrate-posts.ts       # 把 content/posts/*.md 导入数据库
  generate-og-image.ps1  # 生成 public/images/og.png 分享图
e2e/
  site.spec.ts           # Playwright 端到端用例
src/
  app/
    page.tsx             # 首页（精选项目 + 技能 + 资料卡）
    about/               # 关于页
    projects/            # 项目列表 + 详情
    resume/              # 在线简历页
    blog/                # 博客列表（栏目筛选）/ 详情 / 标签
    admin/               # 数据库驱动的博客后台（登录 + CRUD + 上传）
    api/auth/[...nextauth]/  # NextAuth 路由
    api/upload/          # Vercel Blob 图片上传（需登录）
    sitemap.ts           # 注意：带 revalidate，因为博客内容来自数据库
    robots.ts
    not-found.tsx        # 自定义 404
  components/
    layout/theme-toggle.tsx  # 深浅色切换（useSyncExternalStore 订阅 <html>）
  content/               # site.config.ts / profile.ts / resume.ts
  lib/
    content/projects.ts  # 项目加载与排序（featured -> startedAt）
    content/posts.ts     # 博客内容（数据库）
    markdown.ts          # Markdown -> 安全 HTML（必须经 sanitize）
    github.ts / db.ts / date.ts / utils.ts
  __tests__/             # 单元测试（3 个文件 38 个用例）
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
cover: '/images/projects/xxx.png'
milestones:
  - title: '里程碑'
    date: '2026-01-16' # 可选，不确定就不要编
    completed: true
---
```

> 封面与正文图片的路径会被单元测试校验是否真实存在，写错会直接让 CI 失败。

### 博客（数据库，不随代码走）

博客内容**不在仓库里**，存放在 Neon PostgreSQL 的 `posts` 表，通过 `/admin` 在线编辑。
表结构见 `scripts/init-db.sql`，字段包括 `slug / title / description / content / cover / tags / category / draft / published_at`。
`category` 用于「技术 / 日常」栏目筛选，博客列表默认只显示「技术」，日常随笔通过「全部 / 日常」标签仍可达。

> `content/posts/*.md` 是**种子数据**：`pnpm build` 会执行 `migrate-posts.ts` 导入缺失的文章。

## Development Workflow

```bash
cd D:/claude_desktop/personal-website
pnpm install
pnpm dev                                  # http://localhost:3000
pnpm build                                # 先跑数据库迁移，再 next build
pnpm run lint && pnpm run format:check && pnpm run typecheck && pnpm run test
pnpm run test:e2e                         # 会自动构建并启动服务（需先装浏览器）
```

首次运行 e2e 需要下载浏览器：`pnpm exec playwright install chromium`。

## Deployment Workflow

1. 修改文件
2. `pnpm run lint && pnpm run format:check && pnpm run typecheck && pnpm run test && pnpm run build`
3. Commit 并 push 到 `main`
4. Vercel 自动构建部署（构建时自动执行幂等数据库迁移）

> **提交前务必跑 `format:check`**：CI 的 quality job 会检查格式，历史上曾因格式未通过导致整个 CI 长期红着（build job 依赖 quality，从未执行）。

## Environment Variables

见 `.env.example`：

| Key                                     | 是否必需 | 说明                                                   |
| --------------------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                  | 必需     | `https://jtwzjn.icu`，用于 metadata / robots / sitemap |
| `POSTGRES_URL`                          | 博客必需 | Neon 连接串；未设置时数据库查询返回空行                |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | 后台必需 | GitHub OAuth App                                       |
| `ADMIN_GITHUB_ID`                       | 后台必需 | 允许登录的管理员 GitHub 数字 ID                        |
| `AUTH_SECRET`                           | 后台必需 | NextAuth 密钥                                          |
| `BLOB_READ_WRITE_TOKEN`                 | 上传必需 | Vercel Blob                                            |
| `GITHUB_TOKEN`                          | 推荐     | 避免 GitHub API 限流                                   |

> Sentry **未接入**：三个 `sentry.*.config.ts` 与 `@sentry/nextjs` 依赖已移除（它们不产生任何效果，只会造成「已具备可观测性」的错觉）。需要时再按官方文档接入 `instrumentation.ts` + `withSentryConfig`，并在 CSP 的 `connect-src` 放行。

## 已知待办

### 可选改进

- [ ] 博客正文的图片上传尚未做尺寸/格式校验（当前仅校验类型与 5MB 上限）
- [ ] 项目页封面可用 `next/og` 动态生成，进一步减少手工维护的静态资源
- [ ] 补充组件级测试（需在文件顶部加 `// @vitest-environment jsdom`，vitest 全局为 jsdom 但纯逻辑测试已改用 node）

## Notes for Future Sessions

- 使用 `pnpm`，不要用 `npm`。
- **pnpm 版本由 `package.json` 的 `packageManager` 字段声明**（当前 `pnpm@11.7.0`），CI 的 `pnpm/action-setup` 会自动读取它。不要在 workflow 里再写死 `version:`——一旦该版本与 `pnpm-workspace.yaml` 所需的版本不兼容，`actions/setup-node` 的 `cache: 'pnpm'` 会执行 `pnpm store path` 而直接失败（历史上 CI 每个 job 都倒在 Setup Node.js，从未跑到 lint）。
- 本地构建若报 `EXDEV: cross-device link not permitted`，是 telemetry 写 `%APPDATA%\nextjs-nodejs\Config` 导致；`dev` / `build` 脚本已设 `NEXT_TELEMETRY_DISABLED=1`。
- 不要提交 `.claude/`、`.env*`、`node_modules`、`.next`、`*.memory.md`、`*.local.md`、`*.local.sh`。
- 站点标题保持 `今天我在家呐`，所有者保持 `hcr`，除非明确要求修改。
- **内容真实性红线**：项目页上的每一个数字都要能被原始材料（周进展报告、课程报告、论文）验证。历史上出现过「接口数量写成 10 余个（实际 8 个）」「返回时间写成 10 秒（实际 30–60 秒）」「项目页日期虚构（写成 2025 年，实际仓库 2026-06-22 建立）」「加州项目事故数低报为 48 万（实际 143 万）」等问题，均已修正。新增内容务必核对来源。
- **隐私红线**：两个开源仓库均需保持无个人姓名、学号、手机号、Cookie、云凭证。修改后应从 GitHub 全新克隆再扫描一遍确认（`git grep` 覆盖全历史）。
- 三个项目：本科毕业设计《基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统》（独立完成）、课程小组项目《加州高速公路事故时空可视分析系统》、《个人网站》。
- `scripts/generate-og-image.ps1` 修改分享图文案后需重新运行；Windows PowerShell 5.1 需要 UTF-8 **带 BOM** 才能正确读取中文字符串与中文路径，且可能需 `Set-ExecutionPolicy -Scope Process Bypass`。
- Windows 上 `git ls-files` / `git diff --name-only` 默认转义非 ASCII 路径（`\346\241\210.md`），会让 `Test-Path` 报非法字符；仓库已设 `core.quotePath=false`。
