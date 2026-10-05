import { describe, expect, it } from 'vitest'

import { markdownToHtml } from '@/lib/markdown'

describe('Markdown 渲染：基础语法', () => {
  it('渲染标题与段落', async () => {
    const html = await markdownToHtml('# 标题\n\n这是段落。')
    expect(html).toContain('<h1>标题</h1>')
    expect(html).toContain('<p>这是段落。</p>')
  })

  it('渲染无序列表', async () => {
    const html = await markdownToHtml('- 第一项\n- 第二项')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>第一项</li>')
  })

  it('渲染行内代码与代码块', async () => {
    const html = await markdownToHtml(
      '使用 `npm run build`。\n\n```python\nprint(1)\n```'
    )
    expect(html).toContain('<code>npm run build</code>')
    expect(html).toContain('<pre>')
  })

  it('渲染加粗与链接', async () => {
    const html = await markdownToHtml('**重点** 与 [链接](https://example.com)')
    expect(html).toContain('<strong>重点</strong>')
    expect(html).toContain('href="https://example.com"')
  })

  it('渲染图片', async () => {
    const html = await markdownToHtml('![说明](/images/projects/demo.png)')
    expect(html).toContain('<img')
    expect(html).toContain('src="/images/projects/demo.png"')
    expect(html).toContain('alt="说明"')
  })
})

describe('Markdown 渲染：GFM 扩展', () => {
  it('渲染表格（项目页大量使用表格）', async () => {
    const html = await markdownToHtml('| 列 A | 列 B |\n|---|---|\n| 1 | 2 |')
    expect(html).toContain('<table>')
    expect(html).toContain('<th>列 A</th>')
    expect(html).toContain('<td>1</td>')
  })

  it('渲染删除线', async () => {
    const html = await markdownToHtml('~~已废弃~~')
    expect(html).toContain('<del>已废弃</del>')
  })
})

describe('Markdown 渲染：安全过滤', () => {
  it('剥离 script 标签', async () => {
    const html = await markdownToHtml('正文\n\n<script>alert(1)</script>')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('alert(1)')
  })

  it('剥离 iframe', async () => {
    const html = await markdownToHtml(
      '<iframe src="https://evil.example"></iframe>'
    )
    expect(html).not.toContain('<iframe')
  })

  it('剥离内联事件处理器', async () => {
    const html = await markdownToHtml('<img src="/x.png" onerror="alert(1)">')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('alert(1)')
  })

  it('剥离 javascript: 协议链接', async () => {
    const html = await markdownToHtml('[点我](javascript:alert(1))')
    expect(html).not.toContain('javascript:')
  })

  it('剥离 style 标签与 style 属性', async () => {
    const html = await markdownToHtml(
      '<style>body{display:none}</style>\n\n<p style="color:red">x</p>'
    )
    expect(html).not.toContain('<style')
    expect(html).not.toContain('display:none')
  })
})
