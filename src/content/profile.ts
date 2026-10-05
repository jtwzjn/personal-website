interface Experience {
  company: string
  role: string
  period: string
  description: string
}

export const profile = {
  name: 'hcr',
  role: '数据科学与大数据技术 · 全栈开发',
  bio: '热爱构建稳定、可扩展的软件系统。专注于数据可视化、大数据处理与全栈开发。',
  location: '中国',
  email: 'wsswwsswijjiijji@163.com',
  avatar: '/images/avatar.png',
  social: {
    github: 'https://github.com/jtwzjn',
    bilibili: 'https://space.bilibili.com/488081089',
  },
  experiences: [] satisfies Experience[],
}
