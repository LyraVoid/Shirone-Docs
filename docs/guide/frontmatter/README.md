---
title: Frontmatter
createTime: 2026/08/31 23:10:00
permalink: /guide/frontmatter/
---

每篇文章都是 `src/content/posts/` 下的一个 Markdown（或 MDX）文件，文件头部的 YAML frontmatter 定义页面元数据。本篇是全部字段的参考手册；文章的创建流程与文件组织见[编写文章](/guide/writing-post/)。

## 什么是 Frontmatter

Frontmatter 是采用 YAML 格式的配置区块，位于 Markdown 文件顶部，由 `---` 分隔符包裹。正文内容写在第二个 `---` 之后：

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

正文从这里开始。
```

## 字段一览

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
| `encrypted` | `boolean` | 否 | 标记为加密文章 |
| `password` | `string` | 否 | 加密密码，设置后隐式启用加密 |
| `passwordHint` | `string` | 否 | 密码输入框下的提示语 |
| `hideHomeContent` | `boolean` | 否 | 加密文章配合使用：在首页、归档、RSS 中隐藏摘要与字数 |

## 分组详解

### 基础元数据

`title` 与 `published` 是仅有的两个必填字段：标题展示在列表与文章页，发布日期决定排序。`description` 缺省时列表卡片会截取正文开头作为摘要——想要可控的展示效果就显式填写。

### 内容关联

`image`、`tags`、`category` 共同决定文章的「外观与入口」：

- 封面图出现在文章卡片，无图时使用默认样式
- 标签一篇文章可多个，分类只有一个；两者由全站文章自动聚合，无需单独维护清单

### 状态控制

| 字段 | 效果 |
| --- | --- |
| `draft: true` | 草稿：生产构建不发布，dev 模式可见 |
| `pinned: true` | 置顶：排在文章列表最前 |
| `updated` | 填写后文章页显示「最后更新于」提示 |
| `lang` | 声明文章语言，不影响界面语言 |
| `comment: false` | 单篇关闭评论 |

### 加密字段

`encrypted` / `password` / `passwordHint` / `hideHomeContent` 四个字段服务于文章加密系统。设置 `password` 即隐式启用加密，无需同时写 `encrypted: true`。

## 图片路径规则

`image` 与正文图片都支持三种写法：

| 写法 | 示例 | 行为 |
| --- | --- | --- |
| 相对路径 | `./cover.webp` | 相对文章文件解析，可走构建优化（推荐） |
| 绝对路径 | `/images/x.webp` | 相对 `public` 目录，原样输出 |
| 远程 URL | `https://cdn.example.com/x.webp` | 原样引用 |

## 时间与时区

`published` / `updated` 按站点配置的 `timeZone`（见[基础配置](/guide/layout/site-config/)）解释与展示。写日期（`2026-08-26`）即可，需要精确到时刻时写完整时间戳。

## YAML 语法注意

- 冒号后必须有空格：`title: 正确`，`title:错误` 会被当作字符串
- 含特殊字符的值加引号：`password: "my-secret"`
- 列表两种写法等价：`tags: [A, B]` 或逐行 `- A` `- B`，缩进保持一致
- 字段名大小写敏感：`Title` 不等于 `title`

## 常见问题

::: collapse
- frontmatter 写错会怎样

  YAML 语法错误会在构建时直接报错并指出文件与行号；字段名拼错则被静默忽略（该字段按默认值处理）。修改后建议跑 `npx astro check` 校验。

- 字段能自定义吗

  不能被主题识别的自定义字段会被忽略（不会报错）。如果只是想在构建脚本中用，放在正文或数据文件中更合适。

- description 和正文首段什么关系

  `description` 优先用于列表卡片、SEO meta 与 RSS；未填写时回退到正文截取。两者职责不同：description 是给读者的「预告」，正文首段是内容本身。
:::
