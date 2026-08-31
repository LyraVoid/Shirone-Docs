---
title: Bilibili 视频
createTime: 2026/08/31 23:30:00
permalink: /guide/writing/media/bilibili/
---

Shirone 提供了零额外负担的 Bilibili 视频嵌入指令，支持 Facade 占位模式与视口临近预加载机制。

## 语法格式

使用 `::bilibili` 行级指令并配置参数：

```markdown
::bilibili{bvid="BV1fK4y1s7Qf" title="演示视频" p=1 preload="auto"}
```

## 属性参数列表

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `bvid` | `string` | 必填 | 无 | Bilibili 视频的 BV 号（如 `BV1fK4y1s7Qf`） |
| `title` | `string` | 必填 | 无 | 视频标题，用于可访问性描述与海报标注 |
| `p` | `number` | 可选 | `1` | 分 P 编号 |
| `preload` | `string` | 可选 | `"none"` | 预加载策略：`"none"`（默认纯占位）或 `"auto"`（视口临近预加载） |

## 预加载策略（preload）

- **`preload="none"`（默认）**：
  首屏严格保持 0 请求。只渲染封面海报与播放按钮，读者手动点击后才加载播放器。
- **`preload="auto"`（视口预加载）**：
  当视频卡片滚动进入读者视口前夕，利用交叉观察器提前初始化播放器容器与元数据，使点击播放更加即时流畅。

## 响应式排版

外层容器统一锁定 16:9 标准比例，在桌面端与移动端均自适应缩放，绝不撑破文章排版。
