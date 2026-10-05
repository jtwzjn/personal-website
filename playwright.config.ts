import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 使用完整 Chromium 的新无头模式，而不是 chromium_headless_shell：
        // 渲染路径与有头浏览器一致，e2e 结果更贴近真实用户所见。
        channel: 'chromium',
      },
    },
  ],
  webServer: {
    // 项目统一使用 pnpm（原为 npm，与实际工具链不一致）
    command: 'pnpm run build && pnpm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
