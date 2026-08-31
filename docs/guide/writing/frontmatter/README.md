---
title: Frontmatter 与文章管理
createTime: 2026/08/31 23:10:00
permalink: /guide/writing/frontmatter/
---

每篇文章都是 `src/content/posts/` 下的一个 Markdown（或 MDX）文件，文件头部的 YAML frontmatter 定义元数据。本篇讲解全部字段、草稿与置顶管理，以及文章的创建流程。

## 创建文章

```bash
pnpm new-post my-first-post
```

命令会在 `src/content/posts/` 下生成带基础 frontmatter 的模板文件，再到文件中编辑内容即可。

## Frontmatter 字段一览

```yaml title="src/content/posts/my-first-post.md"
---
title: 我的第一篇文章
published: 2026-08-26
description: 显示在文章列表和元数据中的简短摘要。
image: ./cover.webp
tags: [Astro, 随笔]
category: 写作
draft: false
---
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 是 | 文章标题 |
| `published` | `date` | 是 | 发布日期，参与排序与展示 |
| `description` | `string` | 否 | 摘要，显示在文章列表卡片与元数据中 |
| `image` | `string` | 否 | 封面图。相对路径（`./cover.webp`）、`public` 绝对路径（`/img/x.webp`）或远程 URL |
| `tags` | `array` | 否 | 标签，驱动标签页与侧栏标签云 |
| `category` | `string` | 否 | 分类，驱动分类页与侧栏分类 |
| `draft` | `boolean` | 否 | `true` 为草稿，不对访客可见 |
| `updated` | `date` | 否 | 更新时间，触发文章页「最后更新」提示 |
| `pinned` | `boolean` | 否 | `true` 时在列表置顶 |
| `lang` | `string` | 否 | 声明文章语言（如 `en`、`zh_CN`） |
| `comment` | `boolean` | 否 | 单篇关闭评论（需评论系统已启用） |
| `encrypted` | `boolean` | 否 | 标记为加密文章（详见[文章加密](/guide/writing/encryption/)） |
| `password` | `string` | 否 | 加密密码，设置后隐式启用加密 |
| `passwordHint` | `string` | 否 | 密码输入框下的提示语 |
| `hideHomeContent` | `boolean` | 否 | 加密文章配合使用：在首页/归档/RSS 中隐藏摘要与字数 |

## 草稿管理

```yaml
draft: true
```

`draft: true` 的文章处于草稿状态：构建时不会发布，访客不可见。本地开发服务器中草稿正常可见（dev 模式含草稿），便于预览。

发布时只需改为 `draft: false`。

## 置顶

```yaml
pinned: true
```

置顶文章排在文章列表最前（多个置顶文章之间仍按发布时间排序）。

## 分类与标签

```yaml
tags: [Astro, Vue, 随笔]
category: 技术
```

- 分类一篇文章一个（`category`），标签可以多个（`tags`）
- 两者都由文章内容自动聚合，无需单独维护清单；分类页、标签页与侧栏 widget 读取这里的数据

## 图片路径规则

`image` 与正文图片都支持三种写法：

| 写法 | 示例 | 行为 |
| --- | --- | --- |
| 相对路径 | `./cover.webp` | 相对文章文件解析，可走构建优化（推荐） |
| 绝对路径 | `/images/x.webp` | 相对 `public` 目录，原样输出 |
| 远程 URL | `https://cdn.example.com/x.webp` | 原样引用 |

使用文章所在目录（`index.md` + 同目录资源）是管理多图文章的推荐方式，详见[图片画廊与文件组织](/guide/writing/gallery/)。

## 时间与时区

`published` / `updated` 按站点配置的 `timeZone`（见[基础配置](/guide/layout/site-config/)）解释与展示。写日期（`2026-08-26`）即可，需要精确到时刻时写完整时间戳。

## 常见问题

**文章不显示**

排查顺序：`draft` 是否为 `true` → frontmatter YAML 语法是否正确（冒号后有空格、列表缩进一致）→ 文件是否在 `src/content/posts/` 下 → 是否重新构建。

**想本地看草稿但不想发布**

保持 `draft: true` 用 `pnpm dev` 预览即可——dev 模式显示草稿，build 产物不含草稿。

**标签和分类页是空的**

标签页/分类页由文章数据聚合生成。至少一篇文章带 `tags` / `category` 后才会出现内容。

**文章排序不对**

列表按 `published` 倒序排列。补录旧文时把 `published` 写成实际日期即可归位。
