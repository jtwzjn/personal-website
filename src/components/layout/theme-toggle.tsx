'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'theme'

/**
 * 订阅 <html> 的 class 变化。
 *
 * 初始类名由 layout.tsx 中的阻塞脚本在首屏渲染前写入，
 * 因此这里直接以 DOM 为唯一数据源，而不是另存一份组件状态——
 * 这样既不会出现两份状态不同步，也避免了在 effect 中 setState。
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

/** 服务端渲染时无法读取 DOM，统一按浅色渲染，注水后再校正 */
function getServerSnapshot() {
  return false
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)

    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // localStorage 不可用（隐私模式等）时，仅本次会话生效
    }
  }

  const label = isDark ? '切换到浅色主题' : '切换到深色主题'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}
