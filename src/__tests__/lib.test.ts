import { describe, expect, it } from 'vitest'

import { formatDate } from '@/lib/date'
import { formatGitHubDate } from '@/lib/github'
import { cn } from '@/lib/utils'

describe('formatDate', () => {
  it('按中文长日期格式输出', () => {
    expect(formatDate('2026-06-22')).toBe('2026年6月22日')
  })

  it('带时间的 ISO 字符串也能正确格式化', () => {
    expect(formatDate('2026-06-22T10:30:00.000Z')).toMatch(/^2026年6月2[12]日$/)
  })
})

describe('formatGitHubDate', () => {
  it('按中文长日期格式输出', () => {
    expect(formatGitHubDate('2026-10-05T07:19:45Z')).toMatch(/^2026年10月5日$/)
  })
})

describe('cn', () => {
  it('合并多个类名', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('忽略假值', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b')
  })

  it('支持条件对象写法', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('后者覆盖冲突的 Tailwind 工具类', () => {
    // tailwind-merge 应保留最后出现的 padding 值
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('不同属性组的类名都保留', () => {
    expect(cn('p-4', 'text-sm')).toBe('p-4 text-sm')
  })
})
