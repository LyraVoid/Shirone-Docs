---
title: 编写文章
createTime: 2026/08/31 23:16:00
permalink: /guide/writing-post/
---

本篇讲解文章的完整生命周期：创建、文件组织、草稿与发布、置顶与排序、分类与标签。字段本身的含义见 [Frontmatter](/guide/frontmatter/)；正文写法的增强语法见[写作](/guide/writing/markdown/basic/)板块。

## 创建文章

```bash
pnpm new-post my-first-post
```

命令会在 `src/content/posts/` 下生成带基础 frontmatter 的模板文件。打开文件补全 `title`、`published` 等字段，正文从第二个 `---` 之后开始写。

也可以直接手工创建 Markdown 文件——模板只是省去重复劳动。

## 文件组织约定

文章全部放在 `src/content/posts/` 下，两种组织形态：

**单文件（少图文章）**

```file-tree title="文章存放目录"
src/content/posts/
├── hello-world.md
└── vue-tips.md
```

**目录 + index.md（多图/多资源文章）**

```file-tree title="文章存放目录"
src/content/posts/
└── my-gallery/
    ├── index.md            # 文章正文
    ├── cover.webp          # 封面（frontmatter: image: ./cover.webp）
    ├── photo-1.webp
    └── photo-2.webp
```

目录形式的收益：图片与文章同目录、相对路径引用，移动或删除文章时资源一并处理，不产生孤儿文件。图片多时优先用这种形态。

> [!TIP]
> **命名建议**
> 文件名会成为 URL 的一部分（slug），建议用英文短横线命名（如 `my-first-post`）；文件名与 Frontmatter 中的 `title` 相互独立——标题可自由包含中文字符与符号。

## 草稿与发布

```yaml
draft: true   # 草稿：build 不发布
draft: false  # 发布
```

推荐的工作流：

::: steps

1. **创建草稿**：`pnpm new-post` 后把 `draft` 设为 `true`。
2. **本地预览**：`pnpm dev` 启动开发服务器——dev 模式下草稿正常可见，随时检查排版。
3. **定稿发布**：内容完善后将 `draft` 改为 `false`，提交并推送触发部署。

:::

## 排序与置顶

文章列表按 `published` 倒序排列。两个控制手段：

- **置顶**：`pinned: true` 排到列表最前（多个置顶之间仍按发布时间倒序）
- **补录旧文**：把 `published` 写成实际日期即可归位，无需迁移文件

## 分类与标签

```yaml
tags: [Astro, Svelte, 随笔]
category: 技术
```

- 分类一篇文章一个（`category`），标签可以多个（`tags`）
- 两者由全站文章自动聚合，无需单独维护清单；分类页、标签页与侧栏 widget 读取这里的数据
- 标签建议复用已有词汇，避免同义标签（如「JS」与「Javascript」）分裂聚合页

## 图片使用

`image`（封面）与正文图片支持相对路径、`public` 绝对路径与远程 URL 三种写法，详见 [Frontmatter 图片路径规则](/guide/frontmatter/#图片路径规则)。批量图片展示用 `:::grid` 画廊语法，见[图片画廊与排版](/guide/writing/markdown/image-grid/)。

## 常见问题

::: collapse
- 文章不显示

  排查顺序：`draft` 是否为 `true` → frontmatter YAML 语法是否正确（冒号后有空格、缩进一致）→ 文件是否在 `src/content/posts/` 下 → 是否重新构建。

- 想本地看草稿但不想发布

  保持 `draft: true` 用 `pnpm dev` 预览即可——dev 模式显示草稿，build 产物不含草稿。

- 标签和分类页是空的

  标签页与分类页由文章数据聚合生成。至少一篇文章带 `tags` / `category` 后才会出现内容。

- new-post 的文件名有讲究吗

  它决定 URL slug。用英文短横线命名最稳妥；改文件名会改变文章地址，已收录的文章改名需谨慎。
:::
