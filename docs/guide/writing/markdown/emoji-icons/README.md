---
title: 原生表情与图标
createTime: 2026/08/31 23:02:00
permalink: /guide/writing/markdown/emoji-icons/
---

Shirone 全面支持原生 Unicode Emoji 与现代化矢量图标库，兼具极高清晰度与零体积损耗。

## 原生 Unicode Emoji

Shirone 直接基于标准 UTF-8 编码渲染原生 Emoji，无需额外的转译插件或客户端字典：

- 可以在文章正文、标题或 frontmatter 中直接输入系统 Emoji。
- 支持各种操作系统的原生彩色字形渲染。

## 矢量图标系统

Shirone 深度集成了 Iconify 与 Material Symbols 图标集：

- 在站点配置、导航栏、侧边栏卡片与自定义组件中，可直接使用标准图标标识符（如 `ri:book-open-line`、`material-symbols:apps-rounded`、`fa6-brands:github`）。
- 图标在构建期进行静态提取与 SVG 矢量内嵌，无需引入整套图标字体包。

## 图标集合查找

你可以访问 [icones.js.org](https://icones.js.org/) 浏览和检索数万款可用图标的编码标识符。
