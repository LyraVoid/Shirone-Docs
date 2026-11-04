---
title: 快速开始
createTime: 2026/08/31 21:30:00
permalink: /guide/get-started/
---

Shirone 支持单仓与双仓两种运行模式。本文介绍如何准备环境、选择其中一种，并在本地运行站点与发布第一篇文章。

## 单仓还是双仓

| | 单仓 | 双仓 |
| --- | --- | --- |
| 文章放在哪 | 主题仓的 `src/content/` | 独立的内容仓 |
| 适合谁 | 第一次做博客，内容可以公开 | 需要私有草稿，或想长期跟随主题更新 |
| 额外步骤 | 无 | 新建一个仓库，配置内容源 |

::: tip 拿不准时
先选单仓。后续如果需要分离内容，运行 `pnpm content:eject` 即可将现有文章和配置迁出到新仓库，无需重写。
:::

## 单仓模式

::: steps

1. **准备环境**

   需要 Node.js 26.13 或更高版本、pnpm 11.28.2 与 Git。

   ```bash
   node -v   # 应 >= v26.13.0
   pnpm -v   # 应为 11.x
   ```

   若未安装 pnpm，执行 `npm install -g pnpm@11.28.2`。Node.js 26 不再内置 corepack，运行 `corepack enable` 会提示找不到命令。

2. **获取主题并启动**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   cd Shirone
   pnpm install
   pnpm dev
   ```

   在浏览器中打开 `http://localhost:4321`。

   也可以不克隆仓库，使用 npm 包在空目录完成初始化：`npx shirones init`，详见 [npm 包](/guide/npm-package/)。

3. **修改站点信息**

   至少修改 `src/config/siteConfig.ts` 中的两项：

   | 字段 | 说明 |
   | --- | --- |
   | `site` | 正式域名，影响 RSS、Sitemap 与分享图 |
   | `title` | 站点名称 |

   个人资料、导航和侧栏分别在 `profileConfig.ts`、`navBarConfig.ts` 与 `sidebarConfig.ts` 中修改。其余配置文件见各功能说明页。

4. **编写第一篇文章**

   ```bash
   pnpm new-post my-first-post
   ```

   文件生成在 `src/content/posts/`，支持 Markdown 与 MDX。最小 frontmatter 如下：

   ```yaml
   ---
   title: 我的第一篇文章
   published: 2026-08-26
   description: 显示在文章列表和搜索结果中的摘要。
   tags: [Astro, 随笔]
   category: 写作
   ---
   ```

5. **构建发布**

   ```bash
   pnpm build
   ```

   产物输出在 `dist/`。选择托管平台时参阅[部署总览](/guide/deploy/overview/)，各平台的构建命令统一填写 `pnpm build`，输出目录填写 `dist`。具体平台的附加设置见对应平台页。

:::

::: warning Windows 用户
PowerShell 阻止运行脚本时，把命令里的 `pnpm`、`npx` 换成 `pnpm.cmd`、`npx.cmd`。
:::

## 双仓模式

双仓的配置分成下面几步，先后完成即可。每一步的结尾都是一个完整的节点，做完可以随时停下来，之后再继续。

::: steps

1. **了解双仓分工**

   阅读[架构概览](/guide/content-separation/concepts/)，确认是否需要双仓。

2. **初始化内容仓**

   [从现有主题仓迁出，或克隆官方模板](/guide/content-separation/init-repo/)。

3. **本地启动预览**

   [配置本地内容路径](/guide/content-separation/local-preview/)，确认页面能正确读取内容仓的文章。

4. **配置内容源**

   本地开发使用 `.env`，生产部署使用平台环境变量，详见[内容源配置](/guide/content-separation/content-sources/)。

5. **通过 YAML 配置站点**

   站点标题、导航、侧栏等均在内容仓中配置，详见[配置覆盖](/guide/content-separation/config-overlay/)。

6. **设置自动发布**

   推送内容后自动触发构建，详见[跨仓自动构建](/guide/content-separation/ci-dispatch/)。也可改用[部署钩子](/guide/content-separation/deploy-hooks/)。

:::

完成第 3 步后，日常写作只需在内容仓操作，无需改动主题仓。

## 环境要求

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 26.13.0 或更高 | 主题 `engines.node` 的要求 |
| pnpm | 11.28.2 | 仓库锁定版本，其他 11.x 通常也可用 |
| Git | 较新版本 | 双仓模式需要 |

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm new-post <文件名>` | 创建文章 |
| `pnpm content:sync` | 将内容仓同步到主题仓（双仓模式） |
| `pnpm content:validate` | 检查内容目录结构与 YAML 配置 |
| `pnpm build` | 完整构建，产物输出在 `dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | 运行 Astro 诊断 |
| `pnpm type-check` | 运行 TypeScript 类型检查 |
| `pnpm format` | 格式化 `src/` 下的代码 |

## 下一步

- 单仓模式：参阅[部署总览](/guide/deploy/overview/)，选择平台发布上线。
- 双仓模式：参阅[内容分离架构概览](/guide/content-separation/concepts/)。
- 了解主题能力：参阅[介绍](/guide/intro/)。
