import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

/**
 * Markdown 渲染管道。
 *
 * 项目内容与博客正文都来自可编辑的 Markdown，渲染结果通过
 * `dangerouslySetInnerHTML` 注入页面，因此必须经过 sanitize：
 * 剥离 script / iframe / 内联事件处理器 / javascript: 协议等，
 * 只保留内容表达所需的安全标签与属性。
 *
 * 在 GitHub 默认白名单（defaultSchema）基础上，仅放宽以下必需能力：
 *  - 表格对齐（GFM 表格的 align 属性）
 *  - 代码块的语言标记（className="language-xxx"，供样式使用）
 *  - 图片懒加载属性
 *  - 外链 target / rel
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    th: [...(defaultSchema.attributes?.th ?? []), 'align'],
    td: [...(defaultSchema.attributes?.td ?? []), 'align'],
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ['className', /^language-./],
    ],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading', 'decoding'],
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
  },
} as typeof defaultSchema

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
