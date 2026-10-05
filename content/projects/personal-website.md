---
title: '个人网站'
slug: 'personal-website'
description: '从零搭建并持续迭代的个人品牌站点，覆盖内容系统、管理后台与自动化部署。'
status: 'in-progress'
progress: 85
githubRepo: 'jtwzjn/personal-website'
featured: 3
tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel']
startedAt: '2026-06-22'
cover: '/images/projects/personal-website/01-home.png'
milestones:
  - title: '完成站点脚手架与 CI/CD 流水线'
    date: '2026-06-22'
    completed: true
  - title: '首页、关于页与项目展示页上线'
    date: '2026-06-22'
    completed: true
  - title: '重构为毛玻璃工业风设计系统'
    date: '2026-06-23'
    completed: true
  - title: '博客系统与数据库管理后台上线'
    date: '2026-06-23'
    completed: true
  - title: '绑定自定义域名 jtwzjn.icu'
    date: '2026-06-24'
    completed: true
  - title: '补充在线简历页与知识库内容'
    date: '2026-11-30'
    completed: false
---

## 项目介绍

这是我的个人品牌网站，目标是建立一个可长期维护、可持续迭代的在线展示平台，用来沉淀项目经历与技术复盘。

### 核心功能

- **项目展示**：Markdown + YAML frontmatter 驱动，支持状态、进度、里程碑与 GitHub 仓库数据联动。
- **博客系统**：内容存储在 PostgreSQL，提供基于 GitHub OAuth 的在线编辑后台，支持草稿、标签、封面图上传。
- **工程化**：ESLint + Prettier + TypeScript + Vitest + Playwright，GitHub Actions 四段式流水线（质量检查 / 单元测试 / 生产构建 / 端到端测试）。
- **安全与 SEO**：配置 CSP、HSTS 等安全响应头，提供 sitemap.xml、robots.txt 与 JSON-LD 结构化数据（Person + WebSite，并与 GitHub / Bilibili 账号建立 sameAs 关联）。
- **深浅色主题**：同一套设计 token 支持两套主题，首屏由阻塞脚本读取本地偏好，避免「先亮后暗」闪烁。

### 技术亮点

- **内容双轨设计**：项目内容随代码走 Markdown，天然具备版本管理与代码评审能力；博客内容存放在数据库中，可在后台在线编辑，无需重新部署即可发布。
- **管理后台鉴权**：使用 NextAuth 接入 GitHub OAuth，并在 `signIn` 回调中校验管理员数字 ID 白名单；图片上传接口额外校验会话状态、文件类型与大小，并生成安全文件名后写入 Vercel Blob。
- **构建期数据迁移**：构建脚本自动执行幂等的 SQL 迁移，使数据库结构与代码版本同步演进，避免出现"代码已更新、表结构未更新"的线上故障。
- **持续部署**：推送到 `main` 分支后由 Vercel 自动构建部署，绑定自定义域名 `jtwzjn.icu`。

### 后续计划

- 将《基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统》毕业设计整理为完整的技术复盘专栏。

## 系统界面

**首页**：hero 区、资料卡与按类别分组的技能栈（27 项技能取自简历数据的同一份来源，避免多处维护）。

![首页](/images/projects/personal-website/01-home.png)

**在线简历页**：求职意向、教育背景与技能栈均来自结构化的 `resume.ts`，空板块自动隐藏；完整简历通过邮件索取，不在公开站点直接提供文件。

![简历页](/images/projects/personal-website/02-resume.png)

**博客列表**：技术 / 日常栏目筛选与标签导航。内容存储在 PostgreSQL，可通过后台在线编辑，无需重新部署即可发布。

![博客列表](/images/projects/personal-website/04-blog.png)

**深色模式**：与浅色共用同一套设计 token，切换后写入 localStorage；首屏由阻塞脚本恢复偏好，不出现闪白。

![深色模式](/images/projects/personal-website/05-dark-mode.png)
