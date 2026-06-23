---
title: '基于大数据的哔哩哔哩视频数据分析与综合评分可视化系统'
slug: 'bilibili-video-analysis'
description: '采集 1500+ B 站视频与 34 万条评论，构建端到端视频质量评价与可视化系统。'
status: 'completed'
progress: 100
githubRepo: 'jtwzjn/bilibili-video-analysis'
tags:
  [
    'Python',
    'Flask',
    'Vue 3',
    'ECharts',
    'PySpark',
    'Hadoop HDFS',
    'RoBERTa',
    'MySQL',
  ]
startedAt: '2026-01-01'
cover: '/images/projects/bilibili-video-analysis.svg'
milestones:
  - title: '完成数据采集'
    date: '2026-01-15'
    completed: true
  - title: '构建 PySpark + HDFS 数据流水线'
    date: '2026-02-28'
    completed: true
  - title: '完成 RoBERTa 情感分析'
    date: '2026-03-31'
    completed: true
  - title: '实现 Flask + Vue3 可视化系统'
    date: '2026-04-30'
    completed: true
  - title: '项目演示视频发布'
    date: '2026-05-01'
    completed: true
---

## 项目介绍

独立设计并实现端到端视频质量评价系统，采集约 1500 个 B 站视频及 34 万条评论数据，覆盖 13 个内容分区。

### 技术亮点

- 基于 **PySpark** 与 **Hadoop HDFS** 构建数据清洗与特征工程流水线，使用 **Parquet** 作为中间存储格式，相比原始 JSON 节省约 70% 存储空间，Spark 读取速度提升约 5 倍。
- 集成 **Erlangshen-RoBERTa** 模型完成评论情感分析，采用分块批处理与断点续传机制，完成 34 万条评论推理。
- 构建基于评论质量系数 **Q** 的动态权重综合评分模型，从加权情感得分、评论一致性、讨论深度三个维度量化评论区质量，使情感分数标准差从 0.629 提升至 0.783，模型区分度提升约 24%。
- 使用 **Flask** 构建 10 余个 RESTful 接口，使用 **Vue 3 + ECharts** 实现排行榜、Q 雷达图、情感分布、模型对比等可视化页面，并支持用户输入任意视频链接，约 10 秒内返回完整分析结果。

### 演示视频

[Bilibili 视频演示](https://www.bilibili.com/video/BV1UNRCBgEyB/)
