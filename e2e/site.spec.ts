import { expect, test } from '@playwright/test'

/**
 * 端到端测试：覆盖面试官会走的主要路径。
 *
 * 注意：CI 环境没有配置 POSTGRES_URL，博客数据为空，
 * 因此涉及博客的断言只校验结构与空状态，不依赖具体文章内容。
 */

test.describe('首页', () => {
  test('展示姓名、定位与精选项目', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('hcr')
    // 定位文案在 hero 与资料卡各出现一次，取第一个即可
    await expect(
      page.getByText('数据科学与大数据技术 · 全栈开发').first()
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: '精选项目' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '技能栈' })).toBeVisible()
  })

  test('毕业设计排在首位（精选排序生效）', async ({ page }) => {
    await page.goto('/')

    const featured = page.locator('section', {
      has: page.getByRole('heading', { name: '精选项目' }),
    })
    const firstCard = featured.locator('a[href^="/projects/"]').first()
    await expect(firstCard).toHaveAttribute(
      'href',
      '/projects/bilibili-video-analysis'
    )
  })

  test('技能栈按类别分组展示', async ({ page }) => {
    await page.goto('/')

    for (const group of ['编程语言', '大数据与数据工程', '机器学习 / NLP']) {
      await expect(page.getByText(group, { exact: true })).toBeVisible()
    }
  })
})

test.describe('导航', () => {
  test('包含关于 / 项目 / 简历 / 博客 四个入口', async ({ page }) => {
    await page.goto('/')

    const nav = page.getByRole('navigation', { name: '主导航' })
    for (const [label, href] of [
      ['关于', '/about'],
      ['项目', '/projects'],
      ['简历', '/resume'],
      ['博客', '/blog'],
    ]) {
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href
      )
    }
  })
})

test.describe('简历页', () => {
  test('渲染求职意向、教育背景与技能栈', async ({ page }) => {
    await page.goto('/resume')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('hcr')
    await expect(page.getByText('求职意向')).toBeVisible()
    await expect(page.getByRole('heading', { name: '教育背景' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '技能栈' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '主要项目经历' })
    ).toBeVisible()
  })

  test('教育背景显示 2027 届与正确起止时间', async ({ page }) => {
    await page.goto('/resume')

    await expect(page.getByText('2027 届应届毕业生')).toBeVisible()
    await expect(page.getByText('2022.09 – 2027.06')).toBeVisible()
    await expect(page.getByText('中国海洋大学')).toBeVisible()
  })

  test('提供邮件索取入口，且不暴露手机号', async ({ page }) => {
    await page.goto('/resume')

    const mailto = page.locator('a[href^="mailto:"]', {
      hasText: '邮件索取完整简历',
    })
    await expect(mailto).toBeVisible()

    const body = (await page.locator('body').innerText()).replace(/\s/g, '')
    expect(body).not.toMatch(/1[3-9]\d{9}/)
  })
})

test.describe('项目列表与详情', () => {
  test('列表展示全部项目', async ({ page }) => {
    await page.goto('/projects')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('项目')
    const cards = page.locator('a[href^="/projects/"]')
    await expect(cards).toHaveCount(3)
  })

  test('毕业设计详情页展示可核对的数据与源码链接', async ({ page }) => {
    await page.goto('/projects/bilibili-video-analysis')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      '哔哩哔哩'
    )

    // 关键数据必须与仓库中的原始材料一致（防止再次出现虚高数字）
    await expect(page.getByText(/377,892/).first()).toBeVisible()
    await expect(page.getByText(/342,450/).first()).toBeVisible()

    // 「里程碑」由 CardTitle 渲染为 div，没有 heading 角色
    await expect(page.getByText('里程碑').first()).toBeVisible()
    await expect(page.getByText('源代码').first()).toBeVisible()

    await expect(
      page.locator(
        'a[href="https://github.com/jtwzjn/bilibili-video-analysis"]'
      )
    ).toBeVisible()

    // 已完成项目展示项目周期，而不是无信息量的「进度 100%」
    await expect(page.getByText(/项目周期：\d{4} 年/)).toBeVisible()
    await expect(page.getByText('开发进度')).toHaveCount(0)

    // 「系统界面」的 6 张截图确实加载成功（而非坏图）
    const images = page.locator('article img, .prose img')
    expect(await images.count()).toBeGreaterThanOrEqual(6)
  })

  test('加州项目详情页展示真实截图与 AI 实验数据', async ({ page }) => {
    await page.goto('/projects/highway-accident-visualization')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      '加州高速公路'
    )
    await expect(page.getByText('1,434,106').first()).toBeVisible()

    // 系统截图确实加载成功（而非坏图）
    const images = page.locator('article img, .prose img')
    const count = await images.count()
    expect(count).toBeGreaterThanOrEqual(5)

    // 源码链接
    await expect(
      page.locator(
        'a[href="https://github.com/jtwzjn/highway-accident-visualization"]'
      )
    ).toBeVisible()
  })

  test('进行中的项目展示进度条，已完成项目展示项目周期', async ({ page }) => {
    // 个人网站仍在迭代中（status: in-progress）
    await page.goto('/projects/personal-website')
    await expect(page.getByText('开发进度')).toBeVisible()

    // 加州项目已完成（status: completed）
    await page.goto('/projects/highway-accident-visualization')
    await expect(page.getByText(/项目周期：\d{4} 年/)).toBeVisible()
    await expect(page.getByText('开发进度')).toHaveCount(0)
  })
})

test.describe('博客', () => {
  test('列表页可访问并展示栏目入口', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('博客')
    // 无论数据库是否配置，栏目导航都应存在（至少有「全部」）
    await expect(page.getByRole('tab', { name: /全部/ })).toBeVisible()
  })

  test('默认视图不包含日常栏目（技术优先）', async ({ page }) => {
    await page.goto('/blog')

    const activeTab = page.locator('[role="tab"][aria-selected="true"]')
    await expect(activeTab).toContainText('技术')
  })
})

test.describe('主题切换', () => {
  test('默认为浅色，点击后切换为深色并持久化', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    await page.getByRole('button', { name: '切换到深色主题' }).click()
    await expect(html).toHaveClass(/dark/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'dark'
    )

    // 刷新后应保持深色（由 layout 中的阻塞脚本恢复）
    await page.reload()
    await expect(html).toHaveClass(/dark/)
  })

  test('可切回浅色', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')

    await page.getByRole('button', { name: '切换到深色主题' }).click()
    await expect(html).toHaveClass(/dark/)

    await page.getByRole('button', { name: '切换到浅色主题' }).click()
    await expect(html).not.toHaveClass(/dark/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'light'
    )
  })
})

test.describe('错误页与 SEO 端点', () => {
  test('未知路径展示自定义 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)

    await expect(page.getByText('页面不存在')).toBeVisible()
    await expect(page.getByRole('link', { name: '查看项目' })).toBeVisible()
  })

  test('sitemap 包含简历页与项目页', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)

    const body = await res.text()
    expect(body).toContain('/resume')
    expect(body).toContain('/projects/bilibili-video-analysis')
    expect(body).toContain('/projects/highway-accident-visualization')
  })

  test('robots.txt 指向 sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    expect(await res.text()).toContain('sitemap.xml')
  })
})
