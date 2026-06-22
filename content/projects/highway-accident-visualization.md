---
title: '加州高速公路事故时空可视分析系统'
slug: 'highway-accident-visualization'
description: '基于 48 万条加州高速公路事故记录，构建多维时空可视分析系统。'
status: 'completed'
progress: 100
githubRepo: 'jtwzjn/highway-accident-visualization'
tags: ['Flask', 'Python', 'D3.js', 'Leaflet', 'Three.js', 'GeoJSON']
startedAt: '2026-04-01'
cover: '/images/projects/highway-accident-visualization.png'
milestones:
  - title: '完成数据接口设计'
    date: '2026-04-15'
    completed: true
  - title: '实现缓存与查询优化'
    date: '2026-04-30'
    completed: true
  - title: '完成 D3.js 可视化图表'
    date: '2026-05-20'
    completed: true
  - title: '完成 Leaflet 地理分析地图'
    date: '2026-05-31'
    completed: true
---

## 项目介绍

负责前后端核心实现，设计 6 个 RESTful 数据接口，支持按时间、区域、事故类型混合筛选约 48 万条事故记录。

### 技术亮点

- 通过全局缓存与 LRU 策略优化重复查询性能，支持 bbox 边界框过滤与区域热点聚合。
- 使用 **D3.js** 实现柱状图、折线图、雷达图、散点图、河流图等 10 余种可视化图表，支持多维度联动刷新。
- 基于 **Leaflet** 搭建加州地理多维分析地图，结合 **GeoJSON** 边界数据实现事故热区定位与下钻分析。
