/**
 * 在线简历的结构化数据。
 *
 * 隐私约定（重要）：
 * 本文件的所有内容都会**公开**渲染到 /resume 页面并进入搜索引擎索引。
 * 因此这里**绝不能**出现手机号、身份证号、学号、家庭住址、微信/QQ 等隐私字段。
 * 完整版简历改为页面提示「可邮件索取」。
 *
 * 数据来源核对：
 * - 教育背景来自毕业设计支撑材料（中国海洋大学 · 数据科学与大数据技术 · 学号  → 2022 级）
 * - 技能项均来自两个真实项目（毕业设计周进展报告 / 可视化课程报告）中实际使用过的技术
 * - 带 TODO 的字段等待本人补充，页面会自动省略空白项
 */

export interface SkillGroup {
  label: string
  items: string[]
}

export interface EducationItem {
  school: string
  college?: string // TODO: 补充学院（例：信息科学与工程学部）
  major: string
  degree: string
  period: string
  gpa?: string // TODO: 可选，排名靠前建议填写
  courses?: string[]
}

export interface HonorItem {
  title: string
  level?: string
  date?: string
}

export interface ExperienceItem {
  org: string
  role: string
  period: string
  description: string
}

export interface ProjectHighlight {
  title: string
  slug: string
  role: string
  summary: string
  highlights: string[]
}

export interface JobIntention {
  roles: string[]
  cities: string[]
  availability: string
  note: string
}

export interface Resume {
  displayName: string
  jobIntention: JobIntention
  education: EducationItem[]
  skillGroups: SkillGroup[]
  honors: HonorItem[]
  experiences: ExperienceItem[]
  projectHighlights: ProjectHighlight[]
  fullResumeNote: string
}

export const resume: Resume = {
  /** 展示名，与站点保持一致 */
  displayName: 'hcr',

  /** 求职意向 */
  jobIntention: {
    // TODO: 确认目标岗位口径。当前按「国央企 / 制造业 IT」方向归纳。
    roles: ['数据开发 / 数据分析', 'IT 信息化 / 数字化'],
    cities: ['不限'], // TODO: 如有偏好请补充
    availability: '2027 届应届毕业生', // TODO: 确认具体到岗时间
    note: '期望从事数据开发、数据分析或企业信息化方向工作，可接受国央企与制造业数字化岗位。',
  },

  /** 教育背景 */
  education: [
    {
      school: '中国海洋大学',
      // college: 'TODO 补充学院',
      major: '数据科学与大数据技术',
      degree: '本科 · 工学学士',
      period: '2022.09 – 2027.06',
      // gpa: 'TODO 可选：GPA 3.x/4.0，专业前 xx%',
      // courses: ['大数据技术原理与应用', '数据分析与数据挖掘', '可视化技术', '数据库原理'],
    },
  ],

  /**
   * 技能分组。
   * 按「国央企 / 制造业 IT」的技术偏好排序：大数据与数据工程在前，
   * 前端框架与个人站点相关的技术在最后。
   */
  skillGroups: [
    {
      label: '编程语言',
      items: ['Python', 'SQL', 'JavaScript / TypeScript'],
    },
    {
      label: '大数据与数据工程',
      items: [
        'Hadoop HDFS',
        'Spark / PySpark',
        'Parquet 列式存储',
        'Flink',
        'MySQL',
        'PostgreSQL',
      ],
    },
    {
      label: '机器学习 / NLP',
      items: [
        'PyTorch',
        'HuggingFace Transformers',
        'RoBERTa 情感分析',
        'scikit-learn',
      ],
    },
    {
      label: '后端与接口开发',
      items: ['Flask', 'RESTful API 设计', '数据库建模与索引优化', '连接池与缓存优化'],
    },
    {
      label: '前端与数据可视化',
      items: ['Vue 3', 'ECharts', 'D3.js', 'Leaflet / GeoJSON', 'React / Next.js'],
    },
    {
      label: '云平台与工程工具',
      items: [
        '华为云 ModelArts',
        '昇腾 MindSpore',
        'Linux / WSL2',
        'Docker',
        'Git / GitHub Actions',
      ],
    },
  ],

  /** 奖项与荣誉 —— TODO: 等待本人补充（国企简历的重要评分项） */
  honors: [],

  /** 实习 / 实践经历 —— TODO: 等待本人补充，若确无实习可改为校园实践 */
  experiences: [],

  /**
   * 项目经历摘要。
   * 详情链接到 /projects 下对应的项目页，避免两处内容重复维护。
   */
  projectHighlights: [
    {
      title: '基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统',
      slug: 'bilibili-video-analysis',
      role: '本科毕业设计 · 独立完成',
      summary:
        '本科毕业设计：采集 1497 个视频（15 个内容分区）与 377,892 条原始评论，经 PySpark 清洗后入库 342,450 条，构建 Hadoop + Spark + RoBERTa + Flask + Vue 3 的端到端视频质量评价系统。',
      highlights: [
        '在 WSL2 中从零搭建 Hadoop 3.3.6 伪分布式集群与 Spark 3.5.8，用 PySpark 完成清洗流水线，Parquet + Snappy 存储比 JSON 省约 70% 空间、读取提速约 5 倍',
        '集成 Erlangshen-RoBERTa 完成 34 万条评论情感分析，GPU 分块批处理 + 断点续传，约 200 条/秒',
        '提出评论质量系数 Q（情感倾向 / 一致性 / 讨论深度三维建模）与动态权重评分模型，情感分数标准差由 0.629 提升至 0.783',
      ],
    },
    {
      title: '加州高速公路事故时空可视分析系统',
      slug: 'highway-accident-visualization',
      role: '课程小组项目 · 主要开发者',
      summary:
        '基于约 48 万条加州高速公路事故记录，构建覆盖数据接口、地理可视化、时空联动与 AI 预测的可视分析系统。',
      highlights: [
        '设计并实现 RESTful 数据接口层（时间 / 区域 / 混合筛选、bbox 边界框过滤）与 LRU 缓存优化',
        '基于 Leaflet + GeoJSON 实现地理可视化，并完成时间轴、地图框选、平行坐标、县级点击四类时空双向联动',
        '完成全加州格点未来事故数预测与高风险区域识别模块，并参与昇腾 MindSpore 模型在华为云 ModelArts 的训练与 API 对接',
      ],
    },
  ],

  /**
   * 完整简历索取说明。
   * 公开页刻意不含手机号等联系方式，也不提供 PDF 下载——
   * 完整版简历（含联系方式）仅通过邮件按需提供，避免隐私信息被搜索引擎
   * 与爬虫批量抓取。
   */
  fullResumeNote:
    '出于隐私考虑，本页面不包含手机号等直接联系方式。如需完整版简历（含联系方式与更多项目细节），欢迎通过上方邮箱与我联系，我会尽快回复。',
}

/** 扁平化技能列表，供首页与关于页的标签云复用，保证单一数据来源。 */
export const allSkills: string[] = resume.skillGroups.flatMap(
  (group) => group.items
)
