---
title: 单文件方案
createTime: 2026/09/01 02:10:00
permalink: /guide/writing/organization/file/
---

单文件方案是 Shirone 博客系统中编写文章的基础组织方式。在 `src/content/posts/`（或内容分离模式下的内容仓 `posts/`）根目录下直接创建单个 `.md` 或 `.mdx` 文件，每篇文章对应一个独立的文件。

## 适用场景

- **纯文字随笔与轻量笔记**：不需要管理大量本地配图或附件的短文。
- **外部图床与 CDN 用户**：封面与插图均托管在外部对象存储（如 COS/OSS/S3/Imgur）或公共图床。
- **快速导入与迁移**：从 Hexo、Hugo、VuePress 等传统静态博客迁移过来的单文件历史文章。

---

## 目录结构

::: file-tree

- src
  - content
    - posts
      - my-first-post.md
      - guide-to-typescript.md
      - 2026-summary.mdx

:::

---

## Frontmatter 配置

在 Markdown 文件顶部添加 YAML 格式的 Frontmatter 元数据：

```markdown title="src/content/posts/my-first-post.md"
---
title: 我的第一篇博客
published: 2026-09-01
description: 这是使用 Shirone 博客编写的第一篇单文件文章。
category: 技术随笔
tags: [Shirone, Astro, Svelte]
image: /images/cover/example.webp
pinned: false
draft: false
---

# 正文从这里开始

这是一篇使用单文件方案创建的 Markdown 文章...
```

### 核心字段速查

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | **是** | 文章标题 |
| `published` | `string \| Date` | **是** | 发布日期（建议 ISO 格式 `YYYY-MM-DD`） |
| `description` | `string` | 否 | 文章摘要，展示在列表卡片与 SEO `meta` 标签中 |
| `category` | `string` | 否 | 分类名称（如 `前端开发`、`随想`） |
| `tags` | `string[]` | 否 | 标签数组（如 `[Astro, Svelte]`） |
| `image` | `string` | 否 | 封面图地址（支持 `/public/` 绝对路径或完整 `https://` 外链） |
| `pinned` | `boolean` | 否 | 是否置顶（置顶文章排在列表首位并显示高亮角标） |
| `draft` | `boolean` | 否 | 是否为草稿（`true` 时生产构建自动忽略） |
| `permalink` | `string` | 否 | 自定义访问 URL（覆盖默认文件名路由） |

---

## 静态资源引用

由于单文件没有独立的附属文件夹，配图与附件需按以下方式引用：

### 1. 站内公共目录 (`public/`)

将图片放置在 `public/images/` 目录下，在 Markdown 中使用以 `/` 开头的绝对路径：

```markdown
![架构图](/images/posts/architecture.webp)
```

### 2. 外部图床与网络图片

直接使用合法的网络 URL：

```markdown
![外部插图](https://cdn.example.com/assets/illustration.png)
```

---

## 路由生成规则

- **默认规则**：文章的访问 URL 自动匹配文件名（不含扩展名）。例如 `src/content/posts/vue3-guide.md` 对应的访问路径为 `/posts/vue3-guide/`。
- **自定义固定链接**：通过在 Frontmatter 中声明 `permalink: "/posts/custom-slug/"` 显式重命名 URL，修改文件名不会导致外部死链。

---

## 方案优缺点对比

### 优势

- **结构扁平直观**：所有文章集中在 `posts/` 根目录下，文件管理器中一目了然。
- **文件体积小**：单个文件即可独立存在，非常适合快速撰写纯文本草稿。
- **迁移极其便利**：便于从其他博客引擎批量复制 `.md` 文件直接使用。

### 注意事项

- **资源分散**：配图需集中存放于 `public/` 目录，文章数量庞大后 `public/` 目录容易杂乱，且删除文章时难以同步清理废弃图片。
- **图片较多时推荐使用 [文件夹方案](/guide/writing/organization/folder/)**：文件夹方案可将文章与私有图片放在同一目录下，实现自包含打包与零外部图床依赖。
