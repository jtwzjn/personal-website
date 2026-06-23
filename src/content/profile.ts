interface Experience {
  company: string
  role: string
  period: string
  description: string
}

export const profile = {
  name: 'hcr',
  role: '全栈开发者',
  bio: '热爱构建稳定、可扩展的软件系统。专注于现代 Web 技术、DevOps 和开源项目。',
  location: '中国',
  email: 'wsswwsswijjiijji@163.com',
  avatar: '/images/avatar.png',
  social: {
    github: 'https://github.com/jtwzjn',
    bilibili: 'https://space.bilibili.com/488081089',
    linkedin: 'https://linkedin.com/in/yourname',
  },
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'PostgreSQL',
    'Docker',
    'GitHub Actions',
  ],
  experiences: [] satisfies Experience[],
}
