---
title: 快速开始
createTime: 2026/08/31 21:30:00
permalink: /guide/get-started/
---

从零开始搭建属于你的 Shirone 博客。

::: tip 不想克隆仓库？
Shirone 也以 `shirones` npm 包的形式发布，在空文件夹中执行 `npx shirones init` 即可初始化博客，详见 [npm 包](/guide/npm-package/)。
:::

## 环境要求

- [Node.js](https://nodejs.org/) ==**22.12** 或更高版本==
- [pnpm](https://pnpm.io/) **9.x**（仓库锁定为 `pnpm@9.14.4`）
- [Git](https://git-scm.com/)

安装完成后，可在终端验证版本：

```bash
node -v   # 应 >= v22.12
pnpm -v   # 应为 9.x
```

::: tip 没有安装 pnpm？
推荐使用 corepack 启用（Node.js 自带）：

```bash
corepack enable
```

也可以通过 npm 全局安装：`npm install -g pnpm`。
:::

## 本地运行

```bash
git clone https://github.com/LyraVoid/Shirone.git
cd Shirone
corepack enable
pnpm install
pnpm dev
```

启动成功后，在浏览器中打开 `http://localhost:4321` 即可看到站点。

::: warning Windows 用户
如果 PowerShell 的脚本执行策略阻止运行命令，请改用 `pnpm.cmd` 和 `npx.cmd`。
:::

## 定制站点

1. 在 `src/config/siteConfig.ts` 中设置正式网址、标题、语言、主题、横幅和显示选项。
2. 在 `src/config/profileConfig.ts` 和 `src/config/navBarConfig.ts` 中更新个人资料与导航。
3. 检查 `src/config/` 中各功能对应的配置文件；文件内注释说明了默认值和可用选项。
4. 替换 `src/content/`、`src/data/` 与 `public/` 中的示例文章、个人数据和媒体资源。

### 核心配置一览

| 文件 | 用途 |
| --- | --- |
| `src/config/siteConfig.ts` | 站点网址、标识、语言、动态配色、横幅、纹理、目录和显示设置 |
| `src/config/profileConfig.ts` | 作者资料与社交链接 |
| `src/config/navBarConfig.ts` | 主导航 |
| `src/config/sidebarConfig.ts` | 侧栏布局、挂件和页面过滤 |
| `src/config/postListConfig.ts` | 分页与列表/网格展示 |
| `src/config/articleConfig.ts` | 更新提示、延伸阅读和文章分享 |
| `src/config/commentConfig.ts` | 可选评论服务 |
| `src/config/musicConfig.ts` | 可选的本地、自定义、Meting 或混合音乐源 |
| `src/config/animeConfig.ts` | 番剧页与本地/Bangumi/Bilibili 快照数据源 |

完整配置契约请参阅主题仓库中的 `src/config/README.md`。

## 撰写文章

文章放在 `src/content/posts/` 中，支持 Markdown 与 MDX。

使用脚手架命令创建新文章，再到对应文件中编辑：

```bash
pnpm new-post my-first-post
```

最小 Frontmatter 示例：

```yaml
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

常用可选字段包括 `updated`、`pinned`、`comment`、`lang`、`encrypted`、`password`、`passwordHint` 和 `hideHomeContent`。

图片可以使用远程 URL、从 `public/` 开始的绝对路径，或相对于文章文件的路径。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm new-post <filename>` | 创建新文章 |
| `pnpm format` | 运行 Biome 格式化代码（提交前必跑） |
| `pnpm check` | 运行 Astro 诊断 |
| `pnpm type-check` | 运行 TypeScript 检查 |
| `pnpm test` | 运行 Playwright 测试 |
| `pnpm build` | 构建站点与 Pagefind 索引到 `dist/` |
| `pnpm preview` | 预览生产构建 |

## 部署

Shirone 会生成静态的 `dist/` 目录，可部署到 Vercel、Netlify、GitHub Pages 或任意静态托管服务。

部署前，请先更新 `src/config/siteConfig.ts` 中的 `site` 和 `base`，然后运行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm type-check
pnpm build
```

托管平台的构建命令填写 `pnpm build`，输出目录填写 `dist`。

## 内容分离（可选）

如果希望将主题代码与个人内容分仓管理（例如内容仓库设为私有），可以使用官方配套仓库 [Shirone-Content](https://github.com/LyraVoid/Shirone-Content)：将文章、说说、数据、媒体与 `config/*.yaml` 覆盖的内容模板放入独立仓库，再让主题仓指向它。

普通用户直接在主题仓的 `src/content/` 中写作即可，详见 [内容分离架构概览](/guide/content-separation/concepts/)。

---

## 下一步

- 回顾 [主题介绍](/guide/intro/)：了解 Shirone 的设计理念与核心特性
- 查阅 [内容分离架构概览](/guide/content-separation/concepts/)：了解双仓解耦与平滑升级机制
