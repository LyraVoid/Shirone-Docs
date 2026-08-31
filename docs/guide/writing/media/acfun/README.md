---
title: AcFun 视频
createTime: 2026/08/31 23:32:00
permalink: /guide/writing/media/acfun/
---

Shirone 支持嵌入 AcFun 弹幕视频网的视频内容，支持预加载与响应式排版。

## 语法格式

使用 `::acfun` 指令并配置参数：

```markdown
::acfun{acid="ac48649632" title="AcFun 视频内容" preload="auto"}
```

## 属性参数列表

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `acid` | `string` | 必填 | 无 | AcFun 视频稿件的 AC 号 |
| `title` | `string` | 必填 | 无 | 视频标题说明 |
| `preload` | `string` | 可选 | `"none"` | 预加载策略：`"none"`（默认）或 `"auto"`（视口临近预加载） |

## 渲染特性

- 采用 16:9 响应式比例，自适应缩放。
- 支持通过 `preload="auto"` 在读者视口滚动临近时提前初始化播放器。
