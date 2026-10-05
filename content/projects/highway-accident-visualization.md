---
title: '加州高速公路事故时空可视分析系统'
slug: 'highway-accident-visualization'
description: '《可视化技术》课程项目：融合 143 万条加州事故记录（2022–2024）与历史气象数据，构建时空可视分析系统并集成昇腾 LSTM 实时预测。'
status: 'completed'
progress: 100
githubRepo: 'jtwzjn/highway-accident-visualization'
githubRepoStatus: 'public'
featured: 2
tags:
  [
    'Flask',
    'Python',
    'D3.js',
    'Leaflet',
    'GeoJSON',
    'scikit-learn',
    '昇腾 MindSpore',
    '华为云 ModelArts',
  ]
startedAt: '2026-03-01'
cover: '/images/projects/highway-accident-visualization/04-map-dashboard.png'
milestones:
  - title: '时空数据变换与清洗（缺失值补齐、平滑、异常剔除）'
    completed: true
  - title: '后端数据接口与 LRU 缓存优化'
    completed: true
  - title: 'Leaflet 地理可视化与四类时空双向联动'
    completed: true
  - title: '气象关联与节假日对比图表模块'
    completed: true
  - title: '系统整合：统一 6 个视图与交互规范'
    completed: true
  - title: 'AI 模块：全加州格点事故预测与高风险区域识别'
    completed: true
  - title: '昇腾 MindSpore LSTM 在 ModelArts 的训练、部署与 API 对接'
    completed: true
---

## 项目介绍

这是《可视化技术》课程的综合实践项目，按课程要求由 **4 人小组**共同提交。**我承担了系统的主要开发工作**，覆盖全局筛选与时空联动交互、系统整合，以及算法增强阶段的 AI 时空预测模块与昇腾 ModelArts 对接。

数据层融合了 **1,434,106 条**加州高速公路事故记录（2022–2024 三年）与 Open-Meteo 历史气象数据，气象匹配率 **100%**。系统实现了从数据接口、地理可视化、时空双向联动到 AI 预测的完整可视分析链路，共 6 个可视化视图、10 余种联动图表。

上图为系统界面：基于 Leaflet 的时空交互地图仪表盘，右侧联动县 Top5 事故类型、24 小时分布、月份矩阵与气象六维雷达图。

### 后端数据接口与性能优化

- 设计并实现系统的 RESTful 数据接口层，支持**全量聚合、按时间筛选（年/月/时段，带分页）、按区域筛选（area / fwy / bbox 多维度）以及混合筛选与实时聚合**。
- 采用**内存缓存 + LRU 策略**优化重复查询，显著降低高频筛选场景下的重复计算开销。
- 143 万条记录**不直接下发浏览器渲染**，改为服务端聚合后返回，配合 bbox 边界框过滤与区域热点聚合，保证前端在低配设备上仍然流畅。
- 提供加州县级 **GeoJSON** 边界接口，支撑地图下钻与区域匹配。

### 地理可视化与时空双向联动

- 基于 **Leaflet + GeoJSON** 县级边界数据搭建加州多维分析地图，实现事故热区定位与县级下钻分析。
- 实现**四类时空双向联动**：
  - 时间轴拖动 → 地图按时段重绘 + 全局筛选状态同步
  - 地图框选 → 触发后端 `bbox` 区域查询并回填图表
  - 平行坐标刷选 → 过滤区域列表并联动地图高亮
  - 县级点击 → 按区域名匹配并联动其他图表
- 设计**全局筛选栏**（月份 / 事故类型 / 时段）作为系统的单一状态源，任一筛选变化即驱动全部页面联动刷新，解决了多图表各自维护状态导致的显示不一致问题。

### 可视化图表与个人分析任务

- 使用 **D3.js** 实现柱状图、折线图、雷达图、散点图、日历图、河流图等 10 余种图表，支持多维度联动刷新与统一 Tooltip 规范（含四方向边界检测）。
- 完成**气象关联**分析模块：事故气温散点图、降水 / 云量与事故率双轴关系、各区域雨天事故率。
- 个人分析任务为「**节假日与极端天气下的事故时空特征**」：通过联动地图与时间轴刷选识别异常时段，定位节假日与恶劣天气下的高风险区域。

### AI 时空预测模块（本人负责）

**模型与实验结果**

| 项目 | 内容 |
|---|---|
| 模型 | **RandomForestRegressor + 分位数风险分级** |
| 预测区间 | 2025-01 – 2025-06（未来 6 个月） |
| 历史窗口 | 2022-08 – 2024-12（29 个月） |
| 预测格点 | **309 个**加州时空格点 |
| 测试集 MAE | **5.64**（占平均事故数 129.47 的 **4.1%**） |
| 测试集 RMSE | 17.32 |
| 风险分级分布 | 低 151 · 中 98 · 高 60（按 q50 / q80 分位切分） |

特征重要性显示**时空自相关是主导信号**：前 6 期均值 `lag_mean_6` 占 **0.689**、同月历史均值 `same_month_mean` 占 **0.310**，而增长率、节假日标记、经纬度等特征合计不足 0.001——这也解释了为什么简单特征即可把 MAE 压到均值的 4.1%。

**功能**

- **全加州格点未来事故数预测**：将事故数据按时空格点聚合、构建滞后项与同月均值等特征并训练预测模型，输出未来 6 个月逐格点事故数预测。
- **高风险 Top N 格点识别**：基于预测结果按分位数切分风险等级并排序，作为地图风险预警图层的输入。
- **单格点历史时序特征提取**：为任意格点提供历史事故序列，支撑下钻分析。

**昇腾 ModelArts 集成**：参与小组 **MindSpore LSTM** 模型在华为云 **ModelArts** 上的训练与部署。由于海外区域在线服务部署失败，改用「Notebook 内完成训练 + Notebook 内部署 Flask 推理服务 + 本地 SSH 隧道」的替代方案，最终完成昇腾模型的云端训练、API 生成与前端可视化集成。

### 系统整合

将各模块整合为统一系统：6 个视图、统一的视觉与交互规范，并完成从「本地数据 → OBS 桶 → ModelArts 训练 → 结果回传 → 可视化接入」的云端数据流转闭环。

## 系统界面

**区域事故总览**：区域排名 + 类型构成 + 12×24 月份小时热力矩阵

![区域事故总览](/images/projects/highway-accident-visualization/01-region-overview.png)

**气象关联分析**：气温降水双轴曲线、各区域雨天事故率气泡图、伤害类型 × 气象特征

![气象关联分析](/images/projects/highway-accident-visualization/02-weather-correlation.png)

**节假日与日常事故对比**：节假日地区图、差值绽放图、事故分类雷达图

![节假日对比](/images/projects/highway-accident-visualization/03-holiday-comparison.png)

**时空交互地图仪表盘**：Leaflet 县级地图 + 县 Top5 类型 + 24 小时分布 + 气象六维雷达

![时空交互地图](/images/projects/highway-accident-visualization/04-map-dashboard.png)

**高维分析**：六维平行坐标，用于识别低风险 / 高风险区域类簇

![六维平行坐标](/images/projects/highway-accident-visualization/05-parallel-coordinates.png)
