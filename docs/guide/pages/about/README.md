---
title: 关于页
createTime: 2026/09/01 00:30:00
permalink: /guide/pages/about/
---

关于页（`/about/`）是完整的自我介绍长文，内容就是一个 Markdown 文件，没有行为配置开关。

## 内容位置

```text
src/content/spec/about.md
```

## 编辑方式

文件首行的一级标题即页面标题，正文支持全部 Markdown 增强语法：

```markdown title="src/content/spec/about.md"
# 关于我

我是 Shirone，写代码也写文字。

## 技术方向

- 前端工程化与设计系统
- 静态站点与内容驱动架构

## 联系方式

- GitHub: [my-github](https://github.com/yourname)
- 邮箱: me@example.com
```

编辑保存后重新构建即生效，访问地址 `/about/`。

## 推荐内容结构

一份好的关于页通常包含：

| 板块 | 内容 |
| --- | --- |
| 自我介绍 | 一两句话说明你是谁、在做什么 |
| 技术方向 | 感兴趣/擅长的领域，可与[技能页](/guide/pages/skills/)呼应 |
| 经历亮点 | 详细版经历可放这里，时间线页放节点式摘要 |
| 联系方式 | 邮箱、社交账号 |
| 本站说明 | 站点技术栈（Astro/Svelte/M3E）、建站契机 |

示例文件本身就是一个好范本：用 `::github` 卡片展示仓库、分区标题组织内容。

## 增强语法都可以用

关于页是普通 Markdown 渲染，意味着你可以使用：

- 提示容器、折叠面板（`::: collapse`）
- GitHub 仓库卡片（`::github{repo="…"}`）
- Mermaid 图表、KaTeX 公式
- 图片画廊 `:::grid`（放个人照片墙很合适）

## 常见问题

**关于页和 profileConfig 什么关系**

`profileConfig`（头像/名称/一句话简介）用于侧栏卡片、页脚、RSS 作者等全局位置；关于页是长文介绍。两者互补——侧栏卡片链接过来就是关于页。

**想让关于页出现在导航**

`LinkPresets` 中已有 `About` 预设（`/about/`），在 `navBarConfig` 的 `links` 中引用即可（默认已挂载在「更多」分组）。

**能改地址吗**

可以。通过自定义链接覆盖 `url`（见[导航栏配置](/guide/layout/navbar/)）；但页面文件路径固定在 `src/content/spec/about.md`。
