---
title: 图片画廊与排版
createTime: 2026/08/31 23:15:00
permalink: /guide/writing/markdown/image-grid/
---

Shirone 提供了强大的多列图片画廊网格与单图尺寸排版控制能力，支持 Lightbox 放大预览与 WebP 自动压缩。

## 图片网格画廊（grid）

使用 `::: grid` 容器将多张图片自动编排为响应式多列画廊：

```markdown
::: grid{columns="3" aspect="16/9" fit="cover"}
![春日摄影](./spring.webp "樱花盛开")
![夏日海滩](./summer.webp "晴空与浪花")
![秋日落叶](./autumn.webp "枫叶大道")
:::
```

### 属性参数

- `columns`：列数，支持 `2`、`3`、`4`（移动端自动响应退化为单列或双列）。
- `aspect`：固定比例，如 `16/9`、`4/3`、`1/1`。
- `fit`：图片适应方式，`cover`（填充裁剪）或 `contain`（完整包含）。

## 单图尺寸与标题控制

在普通 Markdown 图片语法的 alt 文本中直接标注宽度：

```markdown
![架构图 w-60%](./architecture.webp "系统数据流转架构图")

![图标 w-120px](./logo.png "高清徽标")
```

- `w-60%`：将图片宽度限制为父容器的 60% 并水平居中。
- 引号中的内容自动渲染为图片下方的图题说明。
