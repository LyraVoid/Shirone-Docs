---
title: 错误排查
createTime: 2026/09/01 01:00:00
permalink: /guide/faq/troubleshooting/
---

按症状分类的排查手册。排查通用原则：**先看构建日志的错误行号 → 对照最近改动 → 清缓存重试 → 再查本页**。各功能的专属 FAQ 见对应文档页；本页只收录跨板块的通用问题。

## 构建阶段

::: collapse
- `Unsupported engine` / `only-allow pnpm` 报错

  Node 或包管理器版本不满足要求。确认 Node.js ≥ 22.12、使用 pnpm 9.x（仓库锁定 `pnpm@9.14.4`）；`corepack enable` 可对齐版本。见[快速开始](/guide/get-started/)。

- `spawn EPERM` / esbuild 启动失败

  偶发的进程权限问题（Windows 安全软件或沙箱环境常见）。单独重跑一次构建通常即可恢复；持续出现时把项目目录加入安全软件白名单。

- 内容 frontmatter 校验失败

  Shirone 构建第一步 `content:sync` 会校验所有 frontmatter 与 `config/*.yaml` 类型。按报错指出的文件与行号修正；独立成步意味着内容问题与构建问题在日志里天然分开。

- YAML 语法错误

  检查冒号后空格、缩进一致性、特殊字符加引号。见 [Frontmatter](/guide/frontmatter/#yaml-语法注意)。
:::

## 页面与内容

::: collapse
- 文章 / 瞬间不显示

  排查顺序：`draft` 是否为 `true` → frontmatter 语法 → 文件位置（`src/content/posts/`、`src/content/moments/`）→ 是否重新构建。

- 条目（项目/技能等）加了但不显示

  三层检查：页面 `enable` → 条目分类 key 是否在 `categories` 清单中 → 是否被禁用列表（`disabledKeys` / `disabledNames` / `disabledTitles` / `disabledIds`）命中。

- 图标显示为方块

  Iconify 图标集未安装：`pnpm add @iconify-json/<集合名>` 后重新构建。到 [icones.js.org](https://icones.js.org/) 确认图标所属集合。注意不同场景使用的集合不同（侧栏用 `ri:*`，Shirone 主题内部多用 `material-symbols:*`）。

- 增强语法原样显示没渲染

  多数容器语法对结构有严格要求，非法输入会被有意保留为普通 Markdown。对照[写作板块](/guide/writing/markdown/)示例修正结构。

- 修改 Markdown 后 dev 不生效

  Astro dev 缓存了旧编译结果（新 CSS 出现但新 DOM 不存在是典型信号）：
  ```bash
  # 停掉 dev server 后执行
  # Windows PowerShell
  Remove-Item -LiteralPath ".astro/data-store.json" -Force
  pnpm dev
  ```
  仅当出现 Svelte scope hash 或 Stylus 产物不一致时，才进一步清理 `node_modules/.vite` 与整个 `.astro`。
:::

## 功能异常

::: collapse
- 搜索不可用（404 on /pagefind/*）

  Pagefind 索引在 `pnpm build` 末尾生成于 `dist/pagefind/`。检查部署产物是否完整——自定义 CI 时最容易遗漏；确认构建命令没有被精简为单独的 `astro build`。

- 评论 / 音乐 / 统计组件不出现

  三者都有静默关闭机制（配置不完整时零 DOM，不报错）。逐层检查对应 config 的 enable 与必填字段：评论见[评论系统](/guide/article/comments/)、音乐三重条件见[音乐播放器](/guide/widgets/music/)、Umami 解析规则见 [Umami 统计](/guide/features/umami/)。

- 侧栏图标空白

  侧栏图标使用 Remix Icon（`ri:*`）集合，与主题内部的 `material-symbols:*` 命名不互通。到 [icones.js.org](https://icones.js.org/) 选 Remix Icon 集合确认有效名称。

- 样式不对（颜色/圆角/间距异常）

  排查顺序：DOM 是否正确（组件 class 是否存在）→ 样式表是否包含规则 → computed style 是否被覆盖（cascade layer / Typography 所有权）。检查顺序必须是 DOM → 样式表 → computed style → 缓存。
:::

## 部署相关

::: collapse
- 本地正常、线上异常

  对比环境差异：`site`/`base` 配置、产物是否完整上传（含隐藏文件）、平台缓存策略。平台专属问题见[部署板块](/guide/deploy/vercel/)各篇 FAQ。

- 部署后页面 404

  检查平台构建命令与输出目录（`pnpm build` → `dist`）、`base` 配置与访问路径是否一致、静态服务器 try_files 规则（见[服务器部署](/guide/deploy/server/)）。

- 构建在平台超时

  Shirone 构建链路较长。开启平台构建缓存，或参考主题仓库 `deploy.yml.example` 改为 CI 构建后仅交付产物。
:::

## 通用手段

| 手段 | 命令 | 用途 |
| --- | --- | --- |
| 类型诊断 | `npx astro check` | 配置与页面语法，必须 0 错误 |
| 类型检查 | `pnpm type-check` | TypeScript 深度检查 |
| 完整重建 | `pnpm build` | 内容/字体/schema 相关验证 |
| 清缓存重启 | 删除 `.astro/data-store.json` 后 `pnpm dev` | Markdown 编译缓存陈旧 |
| 本地预览产物 | `pnpm preview` | 区分「构建问题」与「部署问题」 |

::: warning 提交前必跑
`pnpm format`（Biome 格式化）是提交前的强制步骤，`npx astro check` 必须零错误。
:::

以上都试过仍未解决？到主题仓库提一个[高质量 Issue](/guide/faq/asking-questions/)。
